import { Cookie, canonicalDomain, parseDate, CookieJar } from "tough-cookie";
import * as fs from "fs";
import { APIBaseURL } from "../Define";
import * as request from "request";

export class CookieParser {
    public static Parse(cookieFile: string): Array<Cookie> {
        let cookies = new Array<Cookie>();
        let cookieData = fs.readFileSync(cookieFile).toString("utf-8").split(/\r\n|\n/);
        cookieData.forEach(function (line) {
            if (/^\s*$/.test(line) || line.startsWith("#")) {
                return;
            }
            let split = line.split(/\t/);
            if (split.length < 7) {
                return;
            }
            var domain = split[0];
            var expiryInt = parseInt(split[4]);
            var cookie = new Cookie({
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

    public static NewCookieJar(file: string): CookieJar {
        let cookies = CookieParser.Parse(file);
        let jar = new CookieJar();
        for (const ck of cookies) {
            jar.setCookieSync(ck, APIBaseURL);
        }
        console.log(jar.getCookieStringSync(APIBaseURL));
        return jar;
    }

    public static RequestCookieJar(file: string): request.CookieJar {
        let cookies = CookieParser.Parse(file);
        let jar = request.jar();
        for (const ck of cookies) {
            jar.setCookie(ck, APIBaseURL);
        }
        return jar;
    }
}
