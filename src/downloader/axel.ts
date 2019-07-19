import { Session } from "../session/session";
import { ExternalDownloader } from "./external";

export class AxelDownloader extends ExternalDownloader {
    constructor(session: Session) {
        super(session);
        this.binary = "axel";
    }

    createCommand(url: string, file: string): string[] {
        return ["-o", file, "-n", "4", "-a", url];
    }

    enableResume(command: string[]): string[] {
        return [...command, "-c"];
    }

    addCookies(command: string[], cookies: string): string[] {
        return [...command, "-H", "Cookie: " + cookies];
    }
}
