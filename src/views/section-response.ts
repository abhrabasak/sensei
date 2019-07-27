import { JsonProperty, JsonObject } from "json2typescript";
import { Section } from "../models";

@JsonObject("SectionResponse")
export class SectionResponse {
    @JsonProperty("elementIds", [String])
    ElementIds: string[] = undefined;
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("itemIds", [String])
    ItemIds: string[] = undefined;
    @JsonProperty("moduleId", String)
    ModuleID: string = undefined;
    @JsonProperty("name", String)
    Name: string = undefined;
    @JsonProperty("slug", String)
    Slug: string = undefined;
    @JsonProperty("trackId", String)
    TrackID: string = undefined;

    public ToModel(): Section {
        return {
            ID: this.ID, Name: this.Name, Symbol: this.Slug,
            ModuleID: this.ModuleID, Items: null,
        }
    }
}
