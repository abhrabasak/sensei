import { Session } from "../session/session";
import { DownloadAction } from "../commands/download-action";
import { CourseResponse, CourseMaterialsResponse } from "../views";
import { OnDemand } from "./on-demand";
import { Result, Ok, Err } from "@usefultools/monads";
import { Course } from "../models";
import { CourseMaterialsURL } from "../define";
import chalk from "chalk";
import { format } from "util";

export class Extractor {
    session: Session;
    args: DownloadAction;

    constructor(session: Session, args: DownloadAction) {
        this.session = session;
        this.args = args;
    }

    public async ListCourses(): Promise<Result<CourseResponse[], Error>> {
        const onDemand = new OnDemand(this.session, "", this.args);
        return await onDemand.ListCourses();
    }

    public async ExtractCourse(className: string): Promise<Result<Course, Error>> {
        const result = await this.getSyllabus(className);
        if (result.is_err()) {
            return Err(result.unwrap_err());
        }
        const syllabus = result.unwrap();
        return await this.convertSyllabus(className, syllabus);
    }

    async getSyllabus(className: string): Promise<Result<CourseMaterialsResponse, Error>> {
        const url = format(CourseMaterialsURL, className);
        return this.session.GetJson(url, CourseMaterialsResponse);
    }

    async convertSyllabus(className: string, cm: CourseMaterialsResponse): Promise<Result<Course, Error>> {
        if (cm.Elements.length == 0) {
            return Ok(null);
        }
        const classID = cm.Elements[0].ID;
        console.log(chalk.green(`Syllabus for Course ${classID}`));
        const ondemand = new OnDemand(this.session, classID, this.args);
        return await ondemand.buildCourse(className, cm);
    }
}
