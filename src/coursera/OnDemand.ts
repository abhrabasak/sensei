import { Session } from "../session/Session";
import { DownloadAction } from "../commands/Sensei";
import { CourseResponse } from "../views/Course";
import { MembershipsURL } from "../Define";
import { MembershipsResponse } from "../views/Membership";

export class OnDemand {
    session: Session;
    args: DownloadAction;
    classID: string;

    constructor(session: Session, classID: string, args: DownloadAction) {
        this.session = session;
        this.args = args;
        this.classID = classID;
    }

    public async ListCourses(): Promise<CourseResponse[]> {
        let memberships = await this.session.GetJson(MembershipsURL, MembershipsResponse);
        return memberships.Linked.Courses;
    }
}
