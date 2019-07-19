import { CommandLineParser } from "@microsoft/ts-command-line";
import { DownloadAction } from "./download-action";

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
