import { JsonProperty, JsonObject } from "json2typescript";

@JsonObject("Anchor")
export class Anchor {
    @JsonProperty("id", String)
    ID: string = undefined; // a,text
    @JsonProperty("url", String)
    Link: string = undefined; // a,[href]
}

@JsonObject("AnchorCollection")
export class AnchorCollection {
    @JsonProperty("elements", [Anchor])
    Elements: Anchor[] = undefined;
}

export class CoContentAsset {
    ID: string // asset,[id]
    Name: string // asset,[name]
    Extension: string // asset,[extension]
}

export class CoContents {
    Assets: CoContentAsset[] // co-content
    Anchors: Anchor[] // co-content
}
