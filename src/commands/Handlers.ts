import { DownloadAction } from "./download-action";
import chalk from "chalk";
import { Session } from "../session/session";
import { SpecializationResponse } from "../views";
import { SpecializationURL, CookieFile } from "../define";
import { Specialization, Course } from "../models";
import { Extractor } from "../coursera/extractor";
import { Result, Ok, Err } from "@usefultools/monads";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { JsonConvert } from "json2typescript";
import { format } from "util";
import { CreateScheduler } from "../scheduler";
import { Workflow } from "../coursera/workflow";

export async function DownloadSpecialization(args: DownloadAction) {
    console.log(chalk.cyan(`Specialization: ${args.ClassNames.values}`));
    const cookieFile = join(args.Path.value, CookieFile);
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

async function GetSpecialization(session: Session, name: string): Promise<Result<Specialization, Error>> {
    let url = format(SpecializationURL, name);
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
    const cookieFile = join(args.Path.value, CookieFile);
    let session = new Session(cookieFile);
    for (const c of courseNames) {
        DownloadOnDemandClass(session, c, args);
    }
}

export async function ListCourses(args: DownloadAction) {
    const cookieFile = join(args.Path.value, CookieFile);
    let session = new Session(cookieFile);
    let extractor = new Extractor(session, args);
    let result = await extractor.ListCourses();
    result.match({
        err: _ => { },
        ok: courses => { courses.forEach(c => console.log(c)); }
    });
}

async function DownloadOnDemandClass(session: Session, className: string, args: DownloadAction): Promise<Result<boolean, Error>> {
    let course: Course;
    const j = new JsonConvert();
    // Check if syllabus is cached - if yes, use it
    const syllabusFile = join(args.Path.value, `${className}-syllabus.json`);
    if (args.CacheSyllabus.value) {
        const syllabusExists = existsSync(syllabusFile);
        if (syllabusExists) {
            const syllabus: string = readFileSync(syllabusFile).toString();
            course = JSON.parse(syllabus);
        }
    }
    // If no cached syllabus is found, generate the syllabus
    if (course == null) {
        const ce = new Extractor(session, args);
        const result = await ce.ExtractCourse(className);
        if (result.is_err()) {
            return Err(result.unwrap_err());
        }
        course = result.unwrap();
    }
    // Check if syllabus should be cached - if yes, save it
    if (args.CacheSyllabus.value) {
        const jsyl = JSON.stringify(course, null, 2);
        writeFileSync(syllabusFile, jsyl);
    }
    if (args.OnlySyllabus.value) {
        return Ok(true);
    }
    const ts = CreateScheduler(session, args);
    const workflow = new Workflow(ts, args, className);
    const completed = workflow.DownloadCourse(course);
    return completed;
}
