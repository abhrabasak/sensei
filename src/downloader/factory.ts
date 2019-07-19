import { Session } from "../session/session";
import { DownloadAction } from "../commands/download-action";
import { WgetDownloader } from "./wget";
import { Aria2Downloader } from "./aria";
import { AxelDownloader } from "./axel";
import { CurlDownloader } from "./curl";
import { IDownloader } from "./external";

export function CreateDownloader(session: Session, args: DownloadAction): IDownloader {
    switch (args.Downloader.value) {
        case "wget":
            return new WgetDownloader(session);
        case "aria":
        case "aria2":
            return new Aria2Downloader(session);
        case "axel":
            return new AxelDownloader(session);
        case "curl":
        default:
            return new CurlDownloader(session);
    }
}
