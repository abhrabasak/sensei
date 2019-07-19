import { Cookie, canonicalDomain, parseDate, CookieJar } from "tough-cookie";
import * as fs from "fs";
import { APIBaseURL } from "../Define";
import { String as TSO } from "typescript-string-operations";

export class CookieService {
    public static Parse(cookieFile: string): Array<Cookie> {
        let cookies = new Array<Cookie>();
        let cookieData = fs.readFileSync(cookieFile).toString("utf-8").split(/\r\n|\n/);
        cookieData.forEach(line => {
            if (/^\s*$/.test(line) || line.startsWith("#")) {
                return;
            }
            let split = line.split(/\t/);
            if (split.length < 7) {
                return;
            }
            let domain = split[0];
            let expiryInt = parseInt(split[4]);
            let cookie = new Cookie({
                domain: canonicalDomain(domain),
                path: split[2],
                secure: split[3].toLowerCase() == "true",
                expires: expiryInt ? new Date(expiryInt * 1000) : undefined,
                key: decodeURIComponent(split[5]),
                value: decodeURIComponent(split[6]),
                httpOnly: split[1].toLowerCase() == "true",
                hostOnly: /^\./.test(domain) ? false : true
            });
            cookies.push(cookie);
        });
        return cookies;
    }

    public static BuildCookieJar(file: string): CookieJar {
        let cookies = CookieService.Parse(file);
        let jar = new CookieJar();
        for (const ck of cookies) {
            jar.setCookieSync(ck, APIBaseURL);
        }
        return jar;
    }

    public static BuildCookieHeader(cookies: Cookie[]): string {
        return TSO.Join("; ", cookies.map(ck => `${ck.key}=${ck.value}`));
    }
}
