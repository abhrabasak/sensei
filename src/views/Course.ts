import { JsonObject, JsonProperty } from "json2typescript";
import { Course } from "../models/Course";

@JsonObject("CourseResponse")
export class CourseResponse {
    @JsonProperty("courseType", String)
    Type: string = undefined;
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("name", String)
    Name: string = undefined;
    @JsonProperty("slug", String)
    Slug: string = undefined;

    public ToModel(): Course {
        return {
            ID: this.ID, Name: this.Name, Symbol: this.Slug
        };
    }
}
