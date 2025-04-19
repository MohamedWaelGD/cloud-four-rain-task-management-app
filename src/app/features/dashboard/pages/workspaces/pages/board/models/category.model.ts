import { GenericModel } from '../../../../../../../core/models/generic.model';
import { CategoryTask } from './category-task.model';

export interface Category extends GenericModel {
  name: string;
  tasks?: CategoryTask[];
}
