import { Ok, Result } from "@usefultools/monads";
import { existsSync, mkdirSync } from "fs";
import { parse } from "url";
import { mkdirsSync } from "fs-extra";

export function EnsureDirExists(dirName: string): Result<string, Error> {
    mkdirsSync(dirName);
    return Ok(dirName);
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

const TrustedFormats = /^mp4$|^srt$|^docx?$|^pptx?$|^xlsx?$|^pdf$|^zip$/;
const ComplexFormats = /.*[^a-zA-Z0-9_-]/;

export function ShouldSkipFormatURL(format: string, link: string): boolean {
    if (format == null || format == "") {
        return true;
    }
    if (ComplexFormats.test(format)) {
        return true;
    }
    // Skip emails
    if (link.includes("mailto") || link.includes("@")) {
        return true;
    }
    const parsed = parse(link);
    // Skip Localhost
    if (parsed.host == "localhost") {
        return true;
    }
    // Skip site root
    if (parsed.path == null || parsed.path == "" || parsed.path == "/") {
        return true;
    }
    if (TrustedFormats.test(format)) {
        return false;
    }
    return false;
}
