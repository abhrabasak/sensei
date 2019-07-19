import { DownloadAction } from "./download-action";
import chalk from "chalk";
import { Session } from "../session/session";
import { SpecializationResponse } from "../views/specialization-response";
import { String as Tso } from "typescript-string-operations";
import { SpecializationURL, CookieFile } from "../Define";
import { Specialization } from "../models/specialization";
import { Extractor } from "../coursera/extractor";
import { Result } from "@usefultools/monads";

export async function DownloadSpecialization(args: DownloadAction) {
    console.log(chalk.cyan(`Specialization: ${args.ClassNames.values}`));
    const cookieFile = CookieFile;
    let session = new Session(cookieFile);
    let result = await GetSpecialization(session, args.ClassNames.values[0]);
    return result.map(sp => {
        console.log(chalk.cyan(`Name: ${sp.Name}`));
        for (let c of sp.Courses) {
            console.log(chalk.green(`Course Name: ${c.Name}`));
            DownloadOnDemandClass(session, c.Symbol, args);
        }
    });
}

async function GetSpecialization(session: Session, name: string): Promise<Result<Specialization, string>> {
    let url = Tso.Format(SpecializationURL, name);
    let result = await session.GetJson(url, SpecializationResponse);
    return result.map(sr => {
        let courses = sr.Linked.Courses.map(cr => cr.ToModel());
        return {
            Name: sr.Elements[0].Name,
            Courses: courses
        };
    });
}

export function DownloadCourses(args: DownloadAction) {
    let courseNames = args.ClassNames.values;
    console.log(chalk.cyan(`Class Names: ${courseNames}`));
    const cookieFile = CookieFile;
    let session = new Session(cookieFile);
    for (const c of courseNames) {
        DownloadOnDemandClass(session, c, args);
    }
}

export async function ListCourses(args: DownloadAction) {
    const cookieFile = CookieFile;
    let session = new Session(cookieFile);
    let extractor = new Extractor(session, args);
    let result = await extractor.ListCourses();
    result.match({
        err: _ => { },
        ok: courses => { courses.forEach(c => console.log(c)); }
    });
}

function DownloadOnDemandClass(session: Session, className: string, args: DownloadAction) {
    console.log(className);
}
