import axios, { AxiosInstance } from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { CookieService } from "./cookie-service";
import { JsonConvert } from "json2typescript";
import { Result, Ok, Err } from "@usefultools/monads";
import { CookieJar } from "tough-cookie";
import { APIBaseURL } from "../Define";

export class Session {
    client: AxiosInstance;
    json: JsonConvert;

    constructor(file: string) {
        let cookieJar = CookieService.BuildCookieJar(file);
        const instance = axios.create({
            withCredentials: true
        });
        axiosCookieJarSupport(instance);
        instance.defaults.jar = cookieJar;
        this.client = instance;
        this.json = new JsonConvert();
    }

    public async GetJson<T>(url: string, type: new () => T): Promise<Result<T, Error>> {
        let response = this.client.get(url);
        let result: Result<T, Error> = await response.then((ar) => {
            if (ar.status == 200) {
                let resJson: T = this.json.deserializeObject(ar.data, type);
                return Ok(resJson);
            } else {
                return Err(new Error("Request Failed"));
            }
        });
        return result;
    }

    public CookieHeader(): string {
        let cjar = <CookieJar>this.client.defaults.jar;
        return cjar.getCookieStringSync(APIBaseURL);
    }
}
