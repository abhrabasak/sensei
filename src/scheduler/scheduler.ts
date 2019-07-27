import { DownloadTask } from "./download-task";
import { Result } from "@usefultools/monads";
import { IDownloader } from "../downloader";
import { DownloadAction } from "../commands/download-action";

export interface IScheduler {
    Schedule(task: DownloadTask): void;
    Complete(): void;
}

export abstract class Scheduler implements IScheduler {
    downloader: IDownloader;
    args: DownloadAction;

    abstract Schedule(task: DownloadTask): void;
    abstract Complete(): void;

    schedule(url: string, file: string): Result<string, string> {
        let result = this.downloader.Download(url, file, this.args.Resume.value);
        return result.map(_ => url);
    }
}
