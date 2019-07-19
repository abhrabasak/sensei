import { Session } from "../session/session";
import { ExternalDownloader } from "./external";

export class CurlDownloader extends ExternalDownloader {
    constructor(session: Session) {
        super(session);
        this.binary = "curl";
    }

    createCommand(url: string, file: string): string[] {
        return [url, "-k", "-#", "-L", "-o", file];
    }

    enableResume(command: string[]): string[] {
        return [...command, "-C", "-"];
    }

    addCookies(command: string[], cookies: string): string[] {
        return [...command, "--cookie", cookies];
    }
}
