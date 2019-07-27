import { JsonProperty, JsonObject } from "json2typescript";
import { ItemResponse } from "./item-response";
import { SectionResponse } from "./section-response";
import { ModuleResponse } from "./module-response";

@JsonObject("CourseMaterialsElement")
class CourseMaterialsElement {
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("moduleIds", [String])
    ModuleIds: string[] = undefined;
}

@JsonObject("CourseMaterialsLinked")
class CourseMaterialsLinked {
    @JsonProperty("onDemandCourseMaterialItems.v2", [ItemResponse])
    Items: ItemResponse[] = undefined;
    @JsonProperty("onDemandCourseMaterialLessons.v1", [SectionResponse])
    Lessons: SectionResponse[] = undefined;
    @JsonProperty("onDemandCourseMaterialModules.v1", [ModuleResponse])
    Modules: ModuleResponse[] = undefined;
}

@JsonObject("CourseMaterialsResponse")
export class CourseMaterialsResponse {
    @JsonProperty("elements", [CourseMaterialsElement])
    Elements: CourseMaterialsElement[] = undefined;
    @JsonProperty("linked", CourseMaterialsLinked)
    Linked: CourseMaterialsLinked = undefined;

    public GetItemCollection(): Map<string, ItemResponse> {
        let imap = new Map<string, ItemResponse>();
        for (const it of this.Linked.Items) {
            imap.set(it.ID, it);
        }
        return imap;
    }

    public GetSectionCollection(): Map<string, SectionResponse> {
        let smap = new Map<string, SectionResponse>();
        for (const s of this.Linked.Lessons) {
            smap.set(s.ID, s);
        }
        return smap;
    }

    public GetModuleCollection(): Map<string, ModuleResponse> {
        let mmap = new Map<string, ModuleResponse>();
        for (const m of this.Linked.Modules) {
            mmap.set(m.ID, m);
        }
        return mmap;
    }

    GetCollection<T extends { ID: string }>(collection: T[]): Map<string, T> {
        let srmap = new Map<string, T>();
        for (const m of collection) {
            srmap.set(m.ID, m);
        }
        return srmap;
    }
}
