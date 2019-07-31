import { JsonProperty, JsonObject } from "json2typescript";
import { Parse } from "xml-core";

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
    ID: string;
    Name: string;
    Extension: string;
}

export class CoContents {
    Assets: CoContentAsset[];
    Anchors: Anchor[];

    public static Parse(doc: string): CoContents {
        const tree = Parse(doc);
        const assetElements = tree.getElementsByTagName("asset");
        assetElements.item
        let assets: CoContentAsset[] = null;
        if (typeof (assetElements) !== typeof (undefined)) {
            assets = Array.from(assetElements).map(a => <CoContentAsset>{
                ID: a.getAttribute("id"),
                Name: a.getAttribute("name"),
                Extension: a.getAttribute("extension")
            });
        }
        const anchorElements = tree.getElementsByTagName("a");
        let anchors: Anchor[] = null;
        if (typeof (anchorElements) !== typeof (undefined)) {
            anchors = Array.from(anchorElements).map(a => <Anchor>{
                ID: a.innerText,
                Link: a.getAttribute("href")
            });
        }
        return {
            Assets: assets,
            Anchors: anchors
        };
    }
}
