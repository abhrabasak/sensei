import { CommandLineChoiceParameter, CommandLineStringListParameter, CommandLineAction, CommandLineFlagParameter, CommandLineIntegerParameter } from "@microsoft/ts-command-line";
import { DownloadSpecialization, DownloadCourses, ListCourses } from "./handlers";

export class DownloadAction extends CommandLineAction {
    // Basic
    public ClassType: CommandLineChoiceParameter;
    public ClassNames: CommandLineStringListParameter;
    public Jobs: CommandLineIntegerParameter;
    //Downloaders
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
            description: "Choice of type",
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
            description: "Number of Jobs",
            argumentName: "JOBS"
        })
        this.Downloader = this.defineChoiceParameter({
            parameterLongName: "--downloader",
            description: "Choice of downloader",
            alternatives: ["curl", "wget", "aria", "aria2", "axel"],
            defaultValue: "curl"
        });
        this.Resume = this.defineFlagParameter({
            parameterLongName: "--resume",
            description: "Is Resume Enabled"
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
