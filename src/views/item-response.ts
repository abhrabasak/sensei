import { JsonObject, JsonProperty } from "json2typescript";
import { Item } from "../models/item";

@JsonObject("ItemContentSummary")
class ItemContentSummary {
    @JsonProperty("typeName", String)
    TypeName: string = undefined;
}

@JsonObject("ItemLockstate")
class ItemLockstate {
    @JsonProperty("lockStatus", String)
    LockStatus: string = undefined;
    @JsonProperty("reasonCode", String)
    ReasonCode: string = undefined;
}

@JsonObject("ItemLockSummary")
class ItemLockSummary {
    @JsonProperty("lockState", ItemLockstate)
    LockState: ItemLockstate = undefined;
}

@JsonObject("ItemResponse")
export class ItemResponse {
    @JsonProperty("contentSummary", ItemContentSummary)
    ContentSummary: ItemContentSummary = undefined;
    @JsonProperty("itemLockSummary", ItemLockSummary)
    ItemLockSummary: ItemLockSummary = undefined;
    @JsonProperty("id", String)
    ID: string
    @JsonProperty("isLocked", Boolean)
    IsLocked: boolean = undefined;
    @JsonProperty("lessonId", String)
    LessonID: string = undefined;
    @JsonProperty("moduleId", String)
    ModuleID: string = undefined;
    @JsonProperty("name", String)
    Name: string = undefined;
    @JsonProperty("slug", String)
    Slug: string = undefined;
    @JsonProperty("trackId", String)
    TrackID: string = undefined;

    public ToModel(): Item {
        return {
            ID: this.ID, Name: this.Name, Symbol: this.Slug,
            SectionID: this.LessonID, ModuleID: this.ModuleID,
            Type: this.ContentSummary.TypeName.toUpperCase(), Resources: null,
        }
    }
}
