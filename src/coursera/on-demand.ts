import { Session } from "../session/session";
import { DownloadAction } from "../commands/download-action";
import { MembershipsURL, MakeCourseraAbsoluteURL, LectureVideosURL, AssetURL, SupplementsURL } from "../define";
import { Result, Ok, Err } from "@usefultools/monads";
import { CourseResponse, CoContents, CoContentAsset, Anchor, MembershipsResponse, AnchorCollection, AssetsResponse } from "../views";
import { ModuleResponse, CourseMaterialsResponse, SectionResponse, ItemResponse, Video, LectureVideosResponse } from "../views";
import { Module, Section, Item, Course, Resource, ResourceGroup } from "../models";
import chalk from "chalk";
import { format } from "util";
import { basename, extname } from "path";
import { CleanFileName, CleanURL } from "../filesystem";

export class OnDemand {
    session: Session;
    args: DownloadAction;
    classID: string;

    constructor(session: Session, classID: string, args: DownloadAction) {
        this.session = session;
        this.args = args;
        this.classID = classID;
    }

    public async ListCourses(): Promise<Result<CourseResponse[], Error>> {
        const result = await this.session.GetJson(MembershipsURL, MembershipsResponse);
        return result.map(memberships => memberships.Linked.Courses);
    }

    // #region Fill Syllabus

    async buildCourse(className: string, cm: CourseMaterialsResponse): Promise<Result<Course, Error>> {
        let modules: Module[] = [];
        const allModules = cm.GetModuleCollection();
        for (const [_, mr] of allModules) {
            console.log(chalk.yellow(`Module [${mr.ID}] [${mr.Name}]`));
            const result = await this.fillModuleSections(mr, cm);
            if (result.is_err()) {
                return Err(result.unwrap_err());
            }
            const module = result.unwrap();
            modules.push(module);
        }
        const course: Course = { ID: this.classID, Name: className, Symbol: className, Modules: modules };
        return Ok(course);
    }

    private async fillModuleSections(mr: ModuleResponse, cm: CourseMaterialsResponse): Promise<Result<Module, Error>> {
        const module = mr.ToModel();
        let sections: Section[] = [];
        const allSections = cm.GetSectionCollection();
        for (const sid of mr.LessonIds) {
            const sr = allSections.get(sid);
            console.log(chalk.magenta(`\tSection [${sr.ID}] [${sr.Name}]`));
            const result = await this.fillSectionItems(sr, cm);
            if (result.is_err()) {
                return Err(result.unwrap_err());
            }
            const section = result.unwrap();
            sections.push(section);
        }
        module.Sections = sections;
        return Ok(module);
    }

    private async fillSectionItems(sr: SectionResponse, cm: CourseMaterialsResponse): Promise<Result<Section, Error>> {
        const section = sr.ToModel();
        let items: Item[] = [];
        const allItems = cm.GetItemCollection();
        for (const iid of sr.ItemIds) {
            const ir = allItems.get(iid);
            console.log(chalk.green(`\t\t${ir.ContentSummary.TypeName.toUpperCase()} Item [${ir.ID}] [${ir.Name}]`));
            if (ir.IsLocked) {
                console.log(chalk.blue(`\t\t\t[Locked] Reason: ${ir.ItemLockSummary.LockState.ReasonCode}`));
                continue;
            }
            const result = await this.fillItemLinks(ir);
            if (result.is_err()) {
                return Err(result.unwrap_err());
            }
            const item = result.unwrap();
            if (item.Resources != null) {
                for (const res of item.Resources) {
                    const maxlen = Math.min(80, res.Link.length);
                    console.log(chalk.cyan(`\t\t\t [${res.Extension}] ${res.Link.slice(0, maxlen)}...`));
                }
            }
            items.push(item);
        }
        section.Items = items;
        return Ok(section);
    }

    private async fillItemLinks(ir: ItemResponse): Promise<Result<Item, Error>> {
        const item = ir.ToModel();
        let resx: Resource[] = [];
        switch (item.Type) {
            case "LECTURE": {
                const result = await this.extractLinksFromLecture(item.ID);
                result.unwrap().Enrich(resx);
            }
                break;
            case "SUPPLEMENT": {
                const result = await this.extractLinksFromSupplement(item.ID);
                result.unwrap().Enrich(resx);
            }
                break;
            case "PhasedPeer":
            case "GradedProgramming":
            case "UngradedProgramming":
            case "Quiz":
            case "Exam":
            case "Programming":
            case "Notebook":
            default:
                console.log(chalk.red(`Unsupported type ${item.Type} in Item ${item.Name} ${item.ID}`))
        }
        item.Resources = resx;
        return Ok(item);
    }

    // #endregion

    private async extractLinksFromLecture(videoID: string): Promise<Result<ResourceGroup, Error>> {
        return await this.extractMediaAndSubtitles(videoID);
    }

    private async extractLinksFromSupplement(elementID: string): Promise<Result<ResourceGroup, Error>> {
        const url = format(SupplementsURL, this.classID, elementID);
        const result = await this.session.GetJson(url, AssetsResponse);
        if (result.is_err()) {
            return Err(result.unwrap_err());
        }
        const sr = result.unwrap();
        const supContent = new ResourceGroup();
        for (const asset of sr.Linked.Assets) {
            const value = asset.Definition.Value;
            const result = await this.extractLinksFromText(value);
            if (result.is_err()) {
                return Err(result.unwrap_err());
            }
            const resx = result.unwrap();
            supContent.Extend(resx);
        }
        // Incomplete implementation - Not downloading Mathjax instructions
        return Ok(supContent);
    }

    // #region Extract Lecture Video

    private async extractMediaAndSubtitles(videoID: string): Promise<Result<ResourceGroup, Error>> {
        const url = format(LectureVideosURL, this.classID, videoID);
        const result = await this.session.GetJson(url, LectureVideosResponse);
        return result.map(vr => {
            if (vr.Linked.Videos.length == 0) {
                console.log("No Videos Available");
                return null;
            }
            let content = new ResourceGroup();
            for (const video of vr.Linked.Videos) {
                this.extractMediaFromVideo(video, content);
                this.extractSubtitlesFromVideo(video, content);
            }
            return content;
        });
    }

    private extractMediaFromVideo(vr: Video, videoContent: ResourceGroup) {
        if (vr.Source.Resolutions != null) {
            const resolution: string = this.args.Resolution.value;
            if (resolution == "") {
                const link = vr.GetBestDownload().unwrap_or(null);
                if (link != null) {
                    const resource: Resource = { Name: vr.ID, Link: link.Mp4VideoURL, Extension: "mp4" };
                    videoContent.set("mp4", [...(videoContent.get("mp4") || []), resource]);
                }
            } else {
                const link = vr.Source.Resolutions.get(resolution);
                if (link != null) {
                    const resource: Resource = { Name: vr.ID, Link: link.Mp4VideoURL, Extension: "mp4" };
                    videoContent.set("mp4", [...(videoContent.get("mp4") || []), resource]);
                }
            }
        }
    }

    private extractSubtitlesFromVideo(vr: Video, videoContent: ResourceGroup) {
        if (vr.Subtitles != null) {
            let lang = this.args.SubtitleLanguage.value;
            if (lang == null) lang = "en";
            const link = vr.Subtitles.get(lang);
            if (link != null) {
                const resource: Resource = { Name: vr.ID, Link: MakeCourseraAbsoluteURL(link), Extension: "srt" };
                videoContent.set("srt", [...(videoContent.get("srt") || []), resource]);
            }
        }
    }

    // #endregion

    // #region Extract Supplements

    private async extractLinksFromText(text: string): Promise<Result<ResourceGroup, Error>> {
        let resx = new ResourceGroup();
        let page = CoContents.Parse(text);
        const result = await this.extractLinksFromAssetTags(page);
        return result.map(assets => {
            resx.Extend(assets);
            const anchors = this.extractLinksFromAnchorTags(page);
            resx.Extend(anchors);
            return resx;
        })
    }

    private async extractLinksFromAssetTags(page: CoContents): Promise<Result<ResourceGroup, Error>> {
        const assetTags = this.extractAssetTags(page);
        const resx = new ResourceGroup();
        if (assetTags.size == 0) {
            return Ok(resx);
        }
        const result = await this.extractAssetURLs(assetTags);
        return result.map(assets => {
            if (assets == null) {
                return resx;
            }
            for (const a of assets) {
                const [title, ext, link] = [CleanFileName(assetTags.get(a.ID).Name), CleanFileName(assetTags.get(a.ID).Extension), a.Link];
                resx.set(ext, [...(resx.get(ext) || []), { Name: title, Link: link, Extension: ext }]);
            }
            return resx;
        })
    }

    private extractAssetTags(page: CoContents): Map<string, CoContentAsset> {
        let assets = new Map<string, CoContentAsset>();
        for (const a of page.Assets) {
            assets.set(a.ID, a);
        }
        return assets;
    }

    private async extractAssetURLs(assetTags: Map<string, CoContentAsset>): Promise<Result<Anchor[], Error>> {
        const assetIDs = [...assetTags.keys()];
        const url = format(AssetURL, assetIDs.join(","));
        const result = await this.session.GetJson(url, AnchorCollection);
        return result.map(ar => {
            if (ar == null) {
                return null;
            }
            return ar.Elements;
        });
    }

    private extractLinksFromAnchorTags(page: CoContents): ResourceGroup {
        const resx = new ResourceGroup();
        for (const a of page.Anchors) {
            if (a.Link == null || a.Link == "") {
                continue;
            }
            const fname = basename(CleanURL(a.Link));
            let ext = extname(fname).toLowerCase();
            if (ext == null || ext == "") {
                continue;
            }
            const base = CleanFileName(fname.replace(ext, ""));
            ext = CleanFileName(ext).replace(/^[ \.]+|[ \.]+$/g, "");
            resx.set(ext, [...(resx.get(ext) || []), { Name: base, Link: a.Link, Extension: ext }]);
        }
        return resx;
    }

    // #endregion
}
