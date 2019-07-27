import { JsonProperty, JsonObject } from "json2typescript";
import { Module } from "../models";

@JsonObject("ModuleResponse")
export class ModuleResponse {
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("learningObjectives", [String])
    Objectives: string[] = undefined;
    @JsonProperty("lessonIds", [String])
    LessonIds: string[] = undefined;
    @JsonProperty("name", String)
    Name: string = undefined;
    @JsonProperty("slug", String)
    Slug: string = undefined;

    public ToModel(): Module {
        return {
            ID: this.ID, Name: this.Name, Symbol: this.Slug, Sections: null,
        }
    }
}
