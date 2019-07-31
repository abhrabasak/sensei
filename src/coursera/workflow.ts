import { IScheduler, DownloadTask } from "../scheduler";
import { DownloadAction } from "../commands/download-action";
import { FileExists, EnsureDirExists, ShouldSkipFormatURL } from "../filesystem";
import { Ok, Result } from "@usefultools/monads";
import chalk from "chalk";
import { statSync, writeFileSync, openSync, closeSync } from "fs";
import { InMemoryMarker } from "../define";
import { join } from "path";
import { Course } from "../models";
import { format } from "util";

type Pair = { xpath: string, cpath: string };

export class Workflow {
    scheduler: IScheduler;
    args: DownloadAction;
    className: string;
    skippedURLs: string[];
    failedURLs: string[];

    constructor(sc: IScheduler, args: DownloadAction, className: string) {
        this.scheduler = sc;
        this.args = args;
        this.className = className;
    }

    DownloadCourse(course: Course): Result<boolean, Error> {
        const result = this.resolveEnsureExecutionPaths();
        return result.map(xc => {
            const cpath = xc.cpath;
            for (const module of course.Modules) {
                console.log(chalk.yellow(`MODULE ${module.Name}`));
                const lastUpdate = new Date(-8640000000000000);
                for (const section of module.Sections) {
                    console.log(chalk.magenta(`\tSECTION ${section.Name}`));
                    const spath = join(cpath, module.Symbol, section.Symbol);
                    EnsureDirExists(spath);
                    for (let ii = 0; ii < section.Items.length; ii++) {
                        const item = section.Items[ii];
                        console.log(chalk.green(`\t\t${item.Type} ITEM ${item.Symbol}`));
                        for (const res of item.Resources) {
                            const fname = join(spath, format("%s-%s.%s", ii.toString().padStart(2, "0"), item.Symbol, res.Extension));
                            this.handleResource(res.Link, res.Extension, fname, lastUpdate);
                        }
                    }
                }
            }
            this.scheduler.Complete();
            return true;
        })
    }

    private resolveEnsureExecutionPaths(): Result<Pair, Error> {
        let xpath = ".";
        if (this.args.Path.value != null) {
            xpath = this.args.Path.value;
        }
        let cpath = join(xpath, this.className);
        EnsureDirExists(cpath);
        return Ok({ xpath, cpath });
    }

    private handleResource(link: string, format: string, fname: string, lastUpdate: Date): Result<Date, Error> {
        const { Overwrite, Resume, SkipDownload } = this.args;
        if (Overwrite.value || Resume.value || !FileExists(fname)) {
            if (!SkipDownload.value) {
                if (link.startsWith(InMemoryMarker)) {
                    const pageContent = link.replace(InMemoryMarker, "");
                    console.log(`Saving page contents to: ${fname}`);
                    writeFileSync(fname, pageContent, { mode: 0o644 });
                } else if (this.skippedURLs != null && ShouldSkipFormatURL(format, link)) {
                    this.skippedURLs.push(link);
                } else {
                    const dt: DownloadTask = {
                        URL: link, File: fname, Callback: this.onCompletionCallback
                    };
                    this.scheduler.Schedule(dt);
                }
            } else {
                // touch file
                const fd = openSync(fname, "w", 0o644);
                closeSync(fd);
            }
            lastUpdate = new Date();
        } else {
            console.log(chalk.cyan(`\t\t> Exists [${fname}]`));
            const fi = statSync(fname);
            const mtime = fi.mtime;
            if (mtime > lastUpdate) {
                lastUpdate = mtime;
            }
        }
        return Ok(lastUpdate);
    }

    private onCompletionCallback(result: Result<string, Error>) {
        return result.map_err(err => {
            if (err != null) {
                console.log(err);
                this.failedURLs.push(err.message);
            }
            return err;
        });
    }
}
