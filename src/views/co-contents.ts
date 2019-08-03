import { JsonProperty, JsonObject } from "json2typescript";
import { XmlElement, XmlObject, XmlAttribute, XmlContent, XmlCollection, XmlChildElement } from "xml-core";

@JsonObject("Anchor")
export class Anchor {
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("url", String)
    Link: string = undefined;
}

@JsonObject("AnchorCollection")
export class AnchorCollection {
    @JsonProperty("elements", [Anchor])
    Elements: Anchor[] = undefined;
}

export interface CoContentAsset {
    ID: string;
    Name: string;
    Extension: string;
}

@XmlElement({ localName: "asset" })
class XCCAsset extends XmlObject implements CoContentAsset {
    @XmlAttribute({ localName: "id" })
    public ID: string;
    @XmlAttribute({ localName: "name" })
    public Name: string;
    @XmlAttribute({ localName: "extension" })
    public Extension: string;
}

@XmlElement({ localName: "a" })
class XCCAnchor extends XmlObject {
    @XmlAttribute({ localName: "href" })
    public Link: string;
    @XmlContent({})
    public Text: string
}

@XmlElement({ localName: "assets", parser: XCCAsset })
class XCCAssets extends XmlCollection<XCCAsset> { }

@XmlElement({ localName: "anchors", parser: XCCAnchor })
class XCCAnchors extends XmlCollection<XCCAnchor> { }

@XmlElement({ localName: "text" })
class XCCText extends XmlObject {
    @XmlChildElement({ parser: XCCAnchors, minOccurs: 0, noRoot: true })
    Anchors: XCCAnchors;
}

@XmlElement({ localName: "texts", parser: XCCText })
class XCCTexts extends XmlCollection<XCCText> { }

@XmlElement({ localName: "co-content" })
class CoContentX extends XmlObject {
    @XmlChildElement({ parser: XCCAssets, minOccurs: 0, noRoot: true })
    public Assets: XCCAssets;
    @XmlChildElement({ parser: XCCTexts, noRoot: true })
    public Texts: XCCTexts;

    public GetAnchors(): Anchor[] {
        const anchors = Array.from(this.Texts.GetIterator())
            .map(t => Array.from(t.Anchors.GetIterator()));
        return [].concat(...anchors);
    }

    public GetAssets(): CoContentAsset[] {
        return Array.from(this.Assets.GetIterator());
    }
}

export class CoContents {
    Assets: CoContentAsset[];
    Anchors: Anchor[];

    public static From(doc: string): CoContents {
        const cc = new CoContentX();
        cc.LoadXml(doc);
        return {
            Assets: cc.GetAssets(),
            Anchors: cc.GetAnchors()
        }
    }
}
