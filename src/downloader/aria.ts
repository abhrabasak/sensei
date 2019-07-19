import { Session } from "../session/session";
import { ExternalDownloader } from "./external";

export class Aria2Downloader extends ExternalDownloader {
    constructor(session: Session) {
        super(session);
        this.binary = "aria2c";
    }

    createCommand(url: string, file: string): string[] {
        return [url, "-o", file, "--check-certificate=false", "--log-level=notice",
            "--max-connection-per-server=4", "--min-split-size=1M"];
    }

    enableResume(command: string[]): string[] {
        return [...command, "-c"];
    }

    addCookies(command: string[], cookies: string): string[] {
        return [...command, "--header", "Cookie: " + cookies];
    }
}
