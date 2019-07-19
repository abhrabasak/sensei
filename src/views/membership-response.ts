import { JsonObject, JsonProperty } from "json2typescript";
import { CourseResponse } from "./course-response";

@JsonObject("MembershipElement")
class MembershipElement {
    @JsonProperty("courseId", String)
    CourseID: string = undefined;
    @JsonProperty("id", String)
    ID: string = undefined;
    @JsonProperty("role", String)
    Role: string = undefined;
    @JsonProperty("userId", Number)
    UserID: number = undefined;
}

@JsonObject("MembershipLinked")
class MembershipLinked {
    @JsonProperty("courses.v1", [CourseResponse])
    Courses: CourseResponse[] = undefined;
}

@JsonObject("MembershipsResponse")
export class MembershipsResponse {
    @JsonProperty("elements", [MembershipElement])
    Elements: MembershipElement[] = undefined;
    @JsonProperty("linked", MembershipLinked)
    Linked: MembershipLinked = undefined;
}
