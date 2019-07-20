import { Session } from "../session/session";
import { DownloadAction } from "../commands/download-action";
import { IScheduler } from "./scheduler";
import { ParallelScheduler } from "./parallel";
import { CreateDownloader } from "../downloader/factory";
import { ConsecutiveScheduler } from "./consecutive";

export function CreateScheduler(session: Session, args: DownloadAction): IScheduler {
    let downloader = CreateDownloader(session, args);
    if (args.Jobs.value > 1) {
        return new ParallelScheduler(downloader, args);
    }
    return new ConsecutiveScheduler(downloader, args);
}
