import { parse } from "url";

export const CookieFile = "C:/Coursera/cookies.txt";
export const HostBaseURL = "https://api.coursera.org";
export const APIBaseURL = "https://api.coursera.org/api";
export const SpecializationURL = APIBaseURL + "/onDemandSpecializations.v1?q=slug&slug=%s&fields=courseIds&includes=courseIds";
export const MembershipsURL = APIBaseURL + "/memberships.v1?includes=courseId,courses.v1&q=me&showHidden=true&filter=current,preEnrolled";
export const CourseMaterialsURL = APIBaseURL + "/onDemandCourseMaterials.v2/?q=slug&slug=%s&includes=modules,lessons,items&&fields=moduleIds,onDemandCourseMaterialModules.v1(name,slug,lessonIds,optional,learningObjectives),onDemandCourseMaterialLessons.v1(name,slug,elementIds,optional,trackId),onDemandCourseMaterialItems.v2(name,slug,contentSummary,isLocked,trackId,itemLockSummary)&showLockedItems=true";
export const LectureAssetsURL = APIBaseURL + "/onDemandLectureAssets.v1/%s~%s/?includes=openCourseAssets";
export const LectureVideosURL = APIBaseURL + "/onDemandLectureVideos.v1/%s~%s/?includes=video&fields=onDemandVideos.v1(sources,subtitles)";
export const SupplementsURL = APIBaseURL + "/onDemandSupplements.v1/%s~%s?includes=asset&fields=openCourseAssets.v1(typeName),openCourseAssets.v1(definition)";
export const AssetURL = APIBaseURL + "/assetUrls.v1?ids=%s";
export const OpenCourseAssetsURL = APIBaseURL + "/openCourseAssets.v1/%s";

export const InMemoryMarker = "#inmemory#"
export const WindowsUNCPrefix = "\\\\?\\"

export function MakeCourseraAbsoluteURL(link: string): string {
    const linkURL = parse(link);
    if (linkURL.host != null) {
        return link;
    }
    return `${HostBaseURL}${link}`;
}
