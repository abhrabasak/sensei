import { Sensei } from "./commands/sensei";

const sensei = new Sensei();
sensei.execute();

// const xml = "<co-content><asset id=\"i5of3mQ4EeiSXgp89vVxrg\" name=\"m1_t1.2\" extension=\"pptx\" assetType=\"generic\"/><text/></co-content>";
// import { xml2js } from "xml-js";
// const r = xml2js(xml, { compact: true, attributesKey: "$", ignoreText: true });
// console.debug(r);

// import { XmlObject, XmlElement, XmlAttribute, XmlChildElement, XmlCollection, XmlContent, IConverter } from "xml-core";

// @XmlElement({ localName: "asset" })
// class Asset extends XmlObject {
//     @XmlAttribute({ localName: "id" })
//     public ID: string;
//     @XmlAttribute({ localName: "name" })
//     public Name: string;
//     @XmlAttribute({ localName: "extension" })
//     public Extension: string;
//     @XmlContent({})
//     public Text: string
// }

// @XmlElement({ localName: "a" })
// class Anchor extends XmlObject {
//     @XmlAttribute({ localName: "href" })
//     public Link: string;
//     @XmlContent({})
//     public Text: string
// }

// @XmlElement({ localName: "assets", parser: Asset })
// class Assets extends XmlCollection<Asset> { }

// @XmlElement({ localName: "anchors", parser: Anchor })
// class Anchors extends XmlCollection<Anchor> { }

// @XmlElement({ localName: "text" })
// class Text extends XmlObject {
//     @XmlChildElement({ parser: Anchors, minOccurs: 0, noRoot: true })
//     Anchors: Anchors;
// }

// @XmlElement({ localName: "texts", parser: Anchor })
// class Texts extends XmlCollection<Text> { }

// const AnchorsConverter: IConverter<Anchor[]> = {
//     set(value: string): Anchor[] {
//         console.debug(value);
//         const texts = new Texts();
//         texts.LoadXml(value);
//         const textsArray = [...texts.GetIterator()];
//         let anchors: Anchor[] = [];
//         for (const t of textsArray) {
//             anchors.push(...t.Anchors.GetIterator());
//         }
//         return anchors;
//     },
//     get(value: Anchor[]): string {
//         return "";
//     }
// }

// @XmlElement({ localName: "co-content" })
// class CoContent extends XmlObject {
//     @XmlChildElement({ parser: Assets, minOccurs: 0, noRoot: true })
//     public Assets: Assets;
//     @XmlChildElement({ minOccurs: 0, converter: AnchorsConverter })
//     public Anchors: Anchor[];
// }

// const xml = "<co-content><a b=\"c\">blah</a><asset id=\"i5of3mQ4EeiSXgp89vVxrg\" name=\"m1_t1.2\" extension=\"pptx\" assetType=\"generic\">Blah</asset><asset id=\"i5of3mQ4EeiSXgp89vVxrg\" name=\"m1_t1.2\" extension=\"pptx\" assetType=\"generic\"/></co-content>";
// const xml2 = "<co-content><head>blah blah</head><text>blah fuck <a b=\"c\">blah</a></text><text>fuck</text><text>blah <a b=\"c\">blah</a> fuck</text></co-content>";
// const cc = new CoContent();
// cc.LoadXml(xml2);
// // console.debug(cc.Assets);
// console.debug(cc.Anchors);
