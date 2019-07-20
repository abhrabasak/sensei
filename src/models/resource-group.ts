import { Resource } from "./resource";

export class ResourceGroup extends Map<string, Resource[]> {
    public Extend(that: ResourceGroup) {
        for (const [k, v] of that) {
            this.set(k, [...this.get(k), ...v]);
        }
    }

    public Enrich(resx: Resource[]) {
        for (const [_, v] of this) {
            resx = [...resx, ...v];
        }
    }
}
