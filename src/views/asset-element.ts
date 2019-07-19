import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("AssetElement")
export class AssetElement {
    @JsonProperty("courseId", String)
    CourseID: string = undefined;
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("itemId", String)
    ItemID: string = undefined;
}
