import { Session } from "../session/session";
import { DownloadAction } from "../commands/download-action";
import { CourseResponse } from "../views/course-response";
import { MembershipsURL, MakeCourseraAbsoluteURL, LectureVideosURL } from "../define";
import { MembershipsResponse } from "../views/membership-response";
import { Result, Ok, Err } from "@usefultools/monads";
import { ModuleResponse, CourseMaterialsResponse, SectionResponse, ItemResponse, Video, LectureVideosResponse } from "../views";
import { Module, Section, Item, Course, Resource, ResourceGroup } from "../models";
import chalk from "chalk";
import { format } from "util";

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
        return Ok(new ResourceGroup());
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
}
