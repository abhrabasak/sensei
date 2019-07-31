import { Result } from "@usefultools/monads";

type URLCallback = (result: Result<string, Error>) => void;

export class DownloadTask {
    URL: string
    File: string
    Callback: URLCallback
}
