import { JsonProperty, Any, JsonObject } from "json2typescript";
import { AssetElement } from "./asset-element";
import { Result, Ok, Err } from "@usefultools/monads";
import { SubtitlesConverter, DownloadConverter } from "./converters";

@JsonObject("VideoDownload")
export class VideoDownload {
    @JsonProperty("mp4VideoUrl", String)
    Mp4VideoURL: string = undefined;
    @JsonProperty("webMVideoUrl", String)
    WebMVideoURL: string = undefined;
}

@JsonObject("VideoSourcePlaylist")
class VideoSourcePlaylist {
    @JsonProperty("hls", String, true)
    Hls: string = undefined;
    @JsonProperty("mpeg-dash", String, true)
    MpegDash: string = undefined;
}

@JsonObject("VideoSource")
class VideoSource {
    @JsonProperty("byResolution", DownloadConverter)
    Resolutions: Map<string, VideoDownload> = undefined;
    @JsonProperty("playlists", VideoSourcePlaylist)
    Playlist: VideoSourcePlaylist = undefined;
}

@JsonObject("Video")
export class Video {
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("sources", VideoSource)
    Source: VideoSource = undefined;
    @JsonProperty("subtitles", SubtitlesConverter)
    Subtitles: Map<string, string> = undefined;

    public GetBestDownload(): Result<VideoDownload, string> {
        let resolutions = this.Source.Resolutions;
        if (resolutions.size == 0) {
            return Err("Not found any video")
        }
        let keys = [...resolutions.keys()].sort().reverse();
        return Ok(resolutions.get(keys[0]));
    }
}

@JsonObject("LectureVideosLinked")
class LectureVideosLinked {
    @JsonProperty("onDemandVideos.v1", [Video])
    Videos: Video[] = undefined;
}

@JsonObject("LectureVideosResponse")
export class LectureVideosResponse {
    @JsonProperty("elements", [AssetElement])
    Elements: AssetElement[] = undefined;
    @JsonProperty("linked", LectureVideosLinked)
    Linked: LectureVideosLinked = undefined;
}
