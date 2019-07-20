import { Session } from "../session/session";
import { DownloadAction } from "../commands/download-action";
import { CourseResponse } from "../views/course-response";
import { MembershipsURL } from "../Define";
import { MembershipsResponse } from "../views/membership-response";
import { Result } from "@usefultools/monads";

export class OnDemand {
    session: Session;
    args: DownloadAction;
    classID: string;

    constructor(session: Session, classID: string, args: DownloadAction) {
        this.session = session;
        this.args = args;
        this.classID = classID;
    }

    public async ListCourses(): Promise<Result<CourseResponse[], Error>> {
        let result = await this.session.GetJson(MembershipsURL, MembershipsResponse);
        return result.map(memberships => memberships.Linked.Courses);
    }
}
