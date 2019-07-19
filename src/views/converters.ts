import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { VideoDownload } from "./lecture-videos-response";

@JsonConverter
export class SubtitlesConverter implements JsonCustomConvert<Map<string, string>> {
    serialize(subtitles: Map<string, string>): any {
        return {};
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
    serialize(resolutions: Map<string, VideoDownload>): any {
        return {};
    }

    deserialize(resolutions: any): Map<string, VideoDownload> {
        let conv = new Map<string, VideoDownload>();
        for (const [res, entry] of Object.entries(resolutions)) {
            conv.set(res, <VideoDownload>entry);
        }
        return conv;
    }
}
