import { DownloadTask } from "./download-task";
import { Scheduler } from "./scheduler";
import { IDownloader } from "../downloader";
import { DownloadAction } from "../commands/download-action";

export class ParallelScheduler extends Scheduler {
    constructor(downloader: IDownloader, args: DownloadAction) {
        super();
        this.downloader = downloader;
        this.args = args;
    }

    Schedule(task: DownloadTask): void {
        throw new Error("Method not implemented.");
    }

    Complete(): void {
        throw new Error("Method not implemented.");
    }
}
