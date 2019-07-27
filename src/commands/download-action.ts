import { CommandLineChoiceParameter, CommandLineStringListParameter, CommandLineAction, CommandLineFlagParameter, CommandLineIntegerParameter, CommandLineStringParameter } from "@microsoft/ts-command-line";
import { DownloadSpecialization, DownloadCourses, ListCourses } from "./handlers";

export class DownloadAction extends CommandLineAction {
    // Basic
    public ClassType: CommandLineChoiceParameter;
    public ClassNames: CommandLineStringListParameter;
    public Jobs: CommandLineIntegerParameter;
    public Path: CommandLineStringParameter;
    public SubtitleLanguage: CommandLineStringParameter;
    public Resolution: CommandLineChoiceParameter;
    // Syllabus
    public OnlySyllabus: CommandLineFlagParameter;
    public CacheSyllabus: CommandLineFlagParameter;
    // Downloaders
    public Downloader: CommandLineChoiceParameter;
    public Resume: CommandLineFlagParameter;

    public constructor() {
        super({
            actionName: "download",
            summary: "Download a class",
            documentation: "Download a class"
        });
    }

    protected onDefineParameters(): void {
        this.ClassType = this.defineChoiceParameter({
            parameterLongName: "--class-type",
            parameterShortName: "-t",
            description: "Choice of class type",
            alternatives: ["spz", "course", "list"],
            defaultValue: "course"
        });
        this.ClassNames = this.defineStringListParameter({
            parameterLongName: "--class-names",
            parameterShortName: "-c",
            description: "Class Names",
            argumentName: "CLASSNAMES"
        });
        this.Jobs = this.defineIntegerParameter({
            parameterLongName: "--jobs",
            description: "Number of Concurrent Jobs",
            argumentName: "JOBS"
        });
        this.Path = this.defineStringParameter({
            parameterLongName: "--path",
            parameterShortName: "-p",
            description: "Path for working directory",
            argumentName: "PATH"
        });
        this.SubtitleLanguage = this.defineStringParameter({
            parameterLongName: "--subtitle-language",
            parameterShortName: "-s",
            description: "Preferred language for subtitles",
            argumentName: "LANG"
        });
        this.Resolution = this.defineChoiceParameter({
            parameterLongName: "--resolution",
            parameterShortName: "-r",
            description: "Preferred Resolution for videos",
            alternatives: ["360p", "540p", "720p", "1080p"],
            defaultValue: "540p"
        });
        this.OnlySyllabus = this.defineFlagParameter({
            parameterLongName: "--only-syllabus",
            description: "Should stop after fetching syllabus"
        });
        this.CacheSyllabus = this.defineFlagParameter({
            parameterLongName: "--cache-syllabus",
            description: "Should use cached syllabus if available",
        });
        this.Downloader = this.defineChoiceParameter({
            parameterLongName: "--downloader",
            description: "Choice of downloader",
            parameterShortName: "-d",
            alternatives: ["curl", "wget", "aria", "aria2", "axel"],
            defaultValue: "curl"
        });
        this.Resume = this.defineFlagParameter({
            parameterLongName: "--resume",
            description: "Enable download resume"
        });
    }

    protected onExecute(): Promise<void> {
        // let promise: Promise<void> = null;
        switch (this.ClassType.value) {
            case "spz":
                DownloadSpecialization(this);
                break;
            case "course":
                DownloadCourses(this);
                break;
            case "list":
                ListCourses(this);
                break;
            default:
                break;
        }
        return Promise.resolve();
    }
}
