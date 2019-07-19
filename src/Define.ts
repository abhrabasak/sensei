export const APIBaseURL = "https://api.coursera.org/api";
export const SpecializationURL = APIBaseURL + "/onDemandSpecializations.v1?q=slug&slug={0}&fields=courseIds&includes=courseIds";
export const MembershipsURL = APIBaseURL + "/memberships.v1?includes=courseId,courses.v1&q=me&showHidden=true&filter=current,preEnrolled";
export const CookieFile = "C:/Coursera/cookies.txt";
