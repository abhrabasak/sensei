import { JsonConverter, JsonCustomConvert, JsonConvert } from "json2typescript";
import { VideoDownload } from "./lecture-videos-response";

@JsonConverter
export class SubtitlesConverter implements JsonCustomConvert<Map<string, string>> {
    serialize(subtitles: Map<string, string>): any {
        return subtitles;
    }

    deserialize(subtitles: any): Map<string, string> {
        let conv = new Map<string, string>();
        for (const [lang, url] of Object.entries(subtitles)) {
            conv.set(lang, <string>url);
        }
        return conv;
    }
}

@JsonConverter
export class DownloadConverter implements JsonCustomConvert<Map<string, VideoDownload>> {
    private jc: JsonConvert = new JsonConvert();

    serialize(resolutions: Map<string, VideoDownload>): any {
        return resolutions;
    }

    deserialize(resolutions: any): Map<string, VideoDownload> {
        let conv = new Map<string, VideoDownload>();
        for (const [res, entry] of Object.entries(resolutions)) {
            const vd = this.jc.deserializeObject(entry, VideoDownload);
            conv.set(res, vd);
        }
        return conv;
    }
}
