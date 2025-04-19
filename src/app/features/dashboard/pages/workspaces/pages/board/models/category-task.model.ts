import { GenericModel } from "../../../../../../../core/models/generic.model";

export interface CategoryTask extends GenericModel {
    name: string;
    description?: string;
    position: number;
    priority: Priority;
    dueDate?: Date;
  }

  export enum Priority {
    low = 'low',
    medium = 'medium',
    high = 'high',
  }