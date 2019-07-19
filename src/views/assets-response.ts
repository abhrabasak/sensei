import { JsonObject, JsonProperty } from "json2typescript";
import { AssetElement } from "./asset-element";

@JsonObject("AssetDefinition")
class AssetDefinition {
    @JsonProperty("dtdId", String)
    DtdID: string = undefined;
    @JsonProperty("value", String)
    Value: string = undefined;
}

// TODO: Inherit from AssetElement
@JsonObject("ItemAsset")
class ItemAsset {
    @JsonProperty("courseId", String)
    CourseID: string = undefined;
    @JsonProperty("definition", AssetDefinition)
    Definition: AssetDefinition = undefined;
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("itemId", String)
    ItemID: string = undefined;
    @JsonProperty("typeName", String)
    TypeName: string = undefined;
}

@JsonObject("AssetsLinked")
class AssetsLinked {
    @JsonProperty("openCourseAssets.v1", [ItemAsset])
    Assets: ItemAsset[]
}

@JsonObject("LectureAssetsResponse")
export class LectureAssetsResponse {
    @JsonProperty("elements", [AssetElement])
    Elements: AssetElement[]
    @JsonProperty("linked", AssetsLinked)
    Linked: AssetsLinked = undefined;
}
