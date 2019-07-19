import { JsonObject, JsonProperty } from "json2typescript";
import { CourseResponse } from "./course-response";

@JsonObject("SpecializationElement")
class SpecializationElement {
    @JsonProperty("courseIds", [String])
    CourseIds: string[] = undefined;
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("name", String)
    Name: string = undefined;
    @JsonProperty("slug", String)
    Slug: string = undefined;
}

@JsonObject("SpecializationLinked")
class SpecializationLinked {
    @JsonProperty("courses.v1", [CourseResponse])
    Courses: CourseResponse[] = undefined;
}

@JsonObject("SpecializationResponse")
export class SpecializationResponse {
    @JsonProperty("elements", [SpecializationElement])
    Elements: SpecializationElement[] = undefined;
    @JsonProperty("linked", SpecializationLinked)
    Linked: SpecializationLinked = undefined;
}
