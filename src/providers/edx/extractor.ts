import { Parse } from "xml-core";
import { SubSection } from "./models/sub-section";

const BaseURL = "";

abstract class PageExtractor {
    abstract extractUnitsFromHTML(page: string, baseURL: string, fileFormats: string[]): void;
    abstract extractSectionsFromHTML(page: string, baseURL: string): void;
    abstract extractCoursesFromHTML(page: string, baseURL: string): void;
}

class ClassicEdXPageExtractor extends PageExtractor {
    extractUnitsFromHTML(page: string, baseURL: string, fileFormats: string[]): void {
        throw new Error("Method not implemented.");
    }
    extractSectionsFromHTML(page: string, baseURL: string): void {
        throw new Error("Method not implemented.");
    }
    extractCoursesFromHTML(page: string, baseURL: string): void {
        throw new Error("Method not implemented.");
    }

    extractUnit(text: string, baseURL: string, fileFormats: string[]): void { }
    private extractVideoYoutubeURL(text: string) { }
    private extractSubtitleURLs(text: string, baseURL: string) { }
    private extractMp4URLs(text: string) { }
    private extractResourcesURLs(text: string, baseURL: string, fileFormats: string[]) { }

    makeURL(section: Element) { }
    getSectionName(section: Element) { }
    makeSubSections(section: Element) { }
}

class CurrentEdXPageExtractor extends ClassicEdXPageExtractor {
    extractUnit(text: string, baseURL: string, fileFormats: string[]): void { }

    extractSectionsCore(page: string, baseURL: string, selector: string): Section[] {
        const dom = Parse(page);
        const sectionElements = Array.from(dom.querySelectorAll(selector)) || [];
        return sectionElements.map(this.toSection)
            .filter(s => s.Name != null || s.Name != undefined);
    }

    extractSectionsFromHTML(page: string, baseURL: string): Section[] {
        return this.extractSectionsCore(page, baseURL, "div.chapter-content-container");
    }

    toSection(section: Element, position: number): Section {
        return <Section>{
            Position: position,
            Name: this.getSectionName(section),
            URL: this.makeURL(section),
            SubSections: this.makeSubSections(section)
        };
    }

    makeURL(section: Element): string {
        return `${BaseURL}${section.querySelector("div div a").getAttribute("href")}`;
    }

    getSectionName(section: Element): string {
        return section.getAttribute("aria-label").substring(0, -8); // TODO: Use the correct index
    }

    makeSubSections(section: Element): SubSection[] {
        const subSectionElements = Array.from(section.querySelectorAll("div.menu-item")) || [];
        return subSectionElements.map(this.toSubSection);
    }

    toSubSection(ss: Element, position: number): SubSection {
        return <SubSection>{
            Position: position,
            Name: ss.querySelector("p").textContent.trim(),
            URL: `${BaseURL}${ss.querySelector("a").getAttribute("href")}`
        };
    }
}

class Section {
    Position: number;
    Name: string;
    URL: string;
    SubSections: SubSection[];
}

class NewEdXPageExtractor extends CurrentEdXPageExtractor {
    static SectionElementSelector = "li.outline-item.section";
    static SectionNameSelector = "button h3";
    static SubSectionElementSelector = "li.vertical.outline-item.focusable";
    static SubSectionNameSelector = "a div div";

    extractSectionsFromHTML(page: string, baseURL: string): Section[] {
        return this.extractSectionsCore(page, baseURL, "li.outline-item.section");
    }

    makeURL(section: Element): string {
        return null;
    }

    getSectionName(section: Element): string {
        return section.querySelector("button h3").textContent.trim();
    }

    makeSubSections(section: Element): SubSection[] {
        const subSectionElements = Array.from(section.querySelectorAll("li.vertical.outline-item.focusable")) || [];
        return subSectionElements.map(this.toSubSection);
    }

    toSubSection(ss: Element, position: number): SubSection {
        return <SubSection>{
            Position: position,
            Name: ss.querySelector("a div div").textContent.trim(),
            URL: ss.querySelector("a").getAttribute("href")
        };
    }
}

export function CreatePageExtractor(url: string): PageExtractor {
    if (url.startsWith("https://courses.edx.org") ||
        url.startsWith("https://mitxpro.mit.edu")) {
        return new NewEdXPageExtractor();
    } else if (url.startsWith("https://edge.edx.org") ||
        url.startsWith("https://lagunita.stanford.edu") ||
        url.startsWith("https://www.fun-mooc.fr")) {
        return new CurrentEdXPageExtractor();
    } else {
        return new ClassicEdXPageExtractor();
    }
}
