import axios, { AxiosInstance } from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import { CookieParser } from "./CookieParser";
import { JsonConvert } from "json2typescript";

export class Session {
    client: AxiosInstance;
    json: JsonConvert;

    constructor(file: string) {
        let cookieJar = CookieParser.NewCookieJar(file);
        const instance = axios.create({
            jar: cookieJar,
            withCredentials: true
        });
        axiosCookieJarSupport(instance);
        instance.defaults.jar = cookieJar;
        this.client = instance;
        this.json = new JsonConvert();
    }

    public async GetJson<T>(url: string, type: new () => T): Promise<T> {
        console.log(url);
        let response = this.client.get(url);
        let model: T = await response.then((ar) => {
            let resJson: T = this.json.deserializeObject(ar.data, type);
            return resJson;
        });
        return model;
    }
}
