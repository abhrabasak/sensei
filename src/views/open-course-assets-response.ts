import { JsonProperty, JsonObject } from "json2typescript";

@JsonObject("OpenCourseAssetDefinition")
class OpenCourseAssetDefinition {
    @JsonProperty("assetId", String) AssetID: string = undefined;
    @JsonProperty("name", String) Name: string = undefined;
    @JsonProperty("string", String) URL: string = undefined;
}

@JsonObject("OpenCourseAssetElement")
class OpenCourseAssetElement {
    @JsonProperty("typeName", String) TypeName: string = undefined;
    @JsonProperty("definition", OpenCourseAssetDefinition) Definition: OpenCourseAssetDefinition = undefined;
    @JsonProperty("id", String) ID: string = undefined;
}

@JsonObject("OpenCourseAssetsResponse")
export class OpenCourseAssetsResponse {
    @JsonProperty("elements", [OpenCourseAssetElement]) Elements: OpenCourseAssetElement[] = undefined;
}
