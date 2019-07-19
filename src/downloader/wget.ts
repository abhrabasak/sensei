import { Session } from "../session/session";
import { ExternalDownloader } from "./external";

export class WgetDownloader extends ExternalDownloader {
    constructor(session: Session) {
        super(session);
        this.binary = "wget";
    }

    createCommand(url: string, file: string): string[] {
        return [url, "-O", file, "--no-cookies", "--no-check-certificate"];
    }

    enableResume(command: string[]): string[] {
        return [...command, "-c"];
    }

    addCookies(command: string[], cookies: string): string[] {
        return [...command, "--header", "Cookie: " + cookies];
    }
}
