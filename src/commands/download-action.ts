import { CommandLineChoiceParameter, CommandLineStringListParameter, CommandLineAction } from "@microsoft/ts-command-line";
import { DownloadSpecialization, DownloadCourses, ListCourses } from "./handlers";

export class DownloadAction extends CommandLineAction {
    // Basic
    public ClassType: CommandLineChoiceParameter;
    public ClassNames: CommandLineStringListParameter;
    //Downloaders
    public Downloader: CommandLineChoiceParameter;

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
        this.Downloader = this.defineChoiceParameter({
            parameterLongName: "--downloader",
            description: "Choice of downloader",
            alternatives: ["curl", "wget", "aria", "aria2", "axel"],
            defaultValue: "curl"
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
