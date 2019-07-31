import { Ok, Result } from "@usefultools/monads";
import { existsSync } from "fs";
import { parse } from "url";

export function EnsureDirExists(dirName: string): Result<void, Error> {
    return Ok(null);
}

export function FileExists(fname: string): boolean {
    return existsSync(fname);
}

export function CleanFileName(fname: string): string {
    let s = decodeURI(fname);
    s = s.replace(":", "-").replace("/", "-")
        .replace("<", "-").replace(">", "-")
        .replace("\"", "-").replace("\\", "-")
        .replace("|", "-").replace("?", "-")
        .replace("*", "-").replace("(", "")
        .replace(")", "").replace("\n", " ").replace("\x00", "-");
    s = s.replace(/^[ \.]+|[ \.]+$/g, "")
    return s;
}

export function CleanURL(link: string): string {
    const u = parse(link);
    const v = new URL(`${u.protocol}//${u.host}${u.pathname}`);
    return v.toString();
}

export function NormalizeFilePath(path: string): string {
    return "";
}
