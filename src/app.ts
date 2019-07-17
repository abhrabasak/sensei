import { Sensei } from "./commands/Sensei";
import { Session } from "./session/Session";
import { SpecializationResponse } from "./views/specialization";
import { JsonConvert, JsonObject, JsonProperty } from "json2typescript";

const args = new Sensei();
args.execute();

// const jo: object = {
//     "elements": [{
//         "courseIds": ["DYv7azSfEeWgIQ7IEhB31Q", "6lQZLjVvEeWfzhKP8GtZlQ", "EdKScTVwEeWW9BKhJ4xW0Q", "NpTR4zVwEeWfzhKP8GtZlQ", "ywoUFzVxEeWWBQrVFXqd1w", "99SZyjVxEeW6RApRXdjJPw"],
//         "description": "In this Software Product Management Specialization, you will master Agile software management practices to lead a team of developers and interact with clients. In the final Capstone Project, you will practice and apply management techniques to realistic scenarios that you will face as a Software Product Manager. You will have the opportunity to share your experiences and learn from the insights of others as part of a Software Product Management", "name": "Software Product Management", "tagline": "Create Better Software using Agile Practices", "id": "AJRj1U-eEeWe3AppgusjuQ", "slug": "product-management"
//     }],
//     "linked": {
//         "courses.v1": [{ "courseType": "v2.ondemand", "id": "6lQZLjVvEeWfzhKP8GtZlQ", "slug": "software-processes-and-agile-practices", "name": "Software Processes and Agile Practices" },
//         { "courseType": "v2.ondemand", "id": "DYv7azSfEeWgIQ7IEhB31Q", "slug": "introduction-to-software-product-management", "name": "Introduction to Software Product Management" },
//         { "courseType": "v2.ondemand", "id": "NpTR4zVwEeWfzhKP8GtZlQ", "slug": "agile-planning-for-software-products", "name": "Agile Planning for Software Products" },
//         { "courseType": "v2.ondemand", "id": "EdKScTVwEeWW9BKhJ4xW0Q", "slug": "client-needs-and-software-requirements", "name": "Client Needs and Software Requirements " },
//         { "courseType": "v2.ondemand", "id": "ywoUFzVxEeWWBQrVFXqd1w", "slug": "reviews-and-metrics-for-software-improvements", "name": "Reviews & Metrics for Software Improvements" },
//         { "courseType": "v2.ondemand", "id": "99SZyjVxEeW6RApRXdjJPw", "slug": "software-product-management-capstone", "name": "Software Product Management Capstone" }]
//     }
// };
// let jsonConvert: JsonConvert = new JsonConvert();
// let model: SpecializationResponse = jsonConvert.deserializeObject(jo, SpecializationResponse);
// console.log(model.Linked.Courses[0].ToModel());
