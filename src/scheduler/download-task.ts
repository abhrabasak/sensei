import { Result } from "@usefultools/monads";

type URLCallback = (result: Result<string, string>) => void;

export class DownloadTask {
    URL: string
    File: string
    Callback: URLCallback
}
