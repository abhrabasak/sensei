import { CommandLineParser, CommandLineChoiceParameter, CommandLineStringListParameter, CommandLineAction } from "@microsoft/ts-command-line";
import { HandleSpecialization, HandleCourses, ListCourses } from "./Handlers";

export class DownloadAction extends CommandLineAction {
    public classType: CommandLineChoiceParameter;
    public classNames: CommandLineStringListParameter;

    public constructor() {
        super({
            actionName: "download",
            summary: "Download a class",
            documentation: "Download a class"
        });
    }

    protected onDefineParameters(): void { // abstract
        this.classType = this.defineChoiceParameter({
            parameterLongName: "--class-type",
            parameterShortName: "-t",
            description: "Choice of type",
            alternatives: ["spz", "course", "list"],
            defaultValue: "course"
        });
        this.classNames = this.defineStringListParameter({
            parameterLongName: "--class-names",
            parameterShortName: "-c",
            description: "Class Names",
            argumentName: "CLASSNAMES"
        });
    }

    protected onExecute(): Promise<void> { // abstract
        // let promise: Promise<void> = null;
        switch (this.classType.value) {
            case "spz":
                HandleSpecialization(this);
                break;
            case "course":
                HandleCourses(this);
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

export class Sensei extends CommandLineParser {
    public constructor() {
        super({
            toolFilename: "sensei",
            toolDescription: "The sensei tool is really great."
        });
        this.addAction(new DownloadAction());
    }

    protected onDefineParameters(): void {
        //
    }

    protected onExecute(): Promise<void> {
        // BusinessLogic.configureLogger(this._verbose.value);
        return super.onExecute();
    }
}
