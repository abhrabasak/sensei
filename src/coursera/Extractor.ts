import { Session } from "../session/session";
import { DownloadAction } from "../commands/download-action";
import { CourseResponse } from "../views/course-response";
import { OnDemand } from "./on-demand";
import { Result } from "@usefultools/monads";

export class Extractor {
    session: Session;
    args: DownloadAction;

    constructor(session: Session, args: DownloadAction) {
        this.session = session;
        this.args = args;
    }

    public async ListCourses(): Promise<Result<CourseResponse[], string>> {
        let onDemand = new OnDemand(this.session, "", this.args);
        return await onDemand.ListCourses();
    }
}
