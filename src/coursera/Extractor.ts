import { Session } from "../session/Session";
import { DownloadAction } from "../commands/Sensei";
import { CourseResponse } from "../views/Course";
import { OnDemand } from "./OnDemand";

export class Extractor {
    session: Session;
    args: DownloadAction;

    constructor(session: Session, args: DownloadAction) {
        this.session = session;
        this.args = args;
    }

    public async ListCourses(): Promise<CourseResponse[]> {
        let onDemand = new OnDemand(this.session, "", this.args);
        return await onDemand.ListCourses();
    }
}
