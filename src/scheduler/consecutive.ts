import { DownloadTask } from "./download-task";
import { IDownloader } from "../downloader/external";
import { DownloadAction } from "../commands/download-action";
import { Scheduler } from "./scheduler";

export class ConsecutiveScheduler extends Scheduler {
    constructor(downloader: IDownloader, args: DownloadAction) {
        super();
        this.downloader = downloader;
        this.args = args;
    }

    Schedule(task: DownloadTask): void {
        let result = this.schedule(task.URL, task.File);
        task.Callback(result);
    }

    Complete(): void {
        // Complete is not applicable to ConsecutiveScheduler
    }
}
