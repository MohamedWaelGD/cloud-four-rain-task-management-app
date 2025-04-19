import { GenericModel } from "../../../../../core/models/generic.model";

export interface Workspace extends GenericModel {
    name: string;
    description: string;
    backgroundPath: string;
}