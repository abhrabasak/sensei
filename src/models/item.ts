import { Resource } from "./resource";

export class Item {
    ID: string
    Name: string
    Symbol: string
    SectionID: string
    ModuleID: string
    Type: string
    Resources: Resource[]
}
