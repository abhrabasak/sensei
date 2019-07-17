import { DownloadAction } from "./Sensei";
import chalk from "chalk";
import { Session } from "../session/Session";
import { SpecializationResponse } from "../views/specialization";
import { String as Tso } from "typescript-string-operations";
import { SpecializationURL } from "../Define";
import { Specialization } from "../models/Specialization";
import { Extractor } from "../coursera/Extractor";

export async function HandleSpecialization(args: DownloadAction) {
    console.log(chalk.cyan(`Specialization: ${args.classNames.values}`));
    const cookieFile = "C:/Coursera/cookies.txt";
    let session = new Session(cookieFile);
    let sp = await GetSpecialization(session, args.classNames.values[0]);
    console.log(chalk.cyan(`Name: ${sp.Name}`));
    for (let c of sp.Courses) {
        console.log(chalk.green(`Course Name: ${c.Name}`));
        DownloadOnDemandClass(session, c.Symbol, args);
    }
}

async function GetSpecialization(session: Session, name: string): Promise<Specialization> {
    let url = Tso.Format(SpecializationURL, name);
    let sr = await session.GetJson(url, SpecializationResponse);
    let courses = sr.Linked.Courses.map(cr => cr.ToModel());
    return {
        Name: sr.Elements[0].Name,
        Courses: courses
    };
}

export function HandleCourses(args: DownloadAction) {
    let courseNames = args.classNames.values;
    console.log(chalk.cyan(`Class Names: ${courseNames}`));
    const cookieFile = "C:/Coursera/cookies.txt";
    let session = new Session(cookieFile);
    for (const c of courseNames) {
        DownloadOnDemandClass(session, c, args);
    }
}

export async function ListCourses(args: DownloadAction) {
    const cookieFile = "C:/Coursera/cookies.txt";
    let session = new Session(cookieFile);
    let extractor = new Extractor(session, args);
    let courses = await extractor.ListCourses();
    for (const c of courses) {
        console.log(c);
    }
}

function DownloadOnDemandClass(session: Session, className: string, args: DownloadAction) {
    console.log(className);
}
