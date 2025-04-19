import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { Category } from '../../models/category.model';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ModalComponent } from "../../../../../../../../shared/components/modal/modal.component";
import { UpsertTaskComponent } from "./components/upsert-task/upsert-task.component";
import { Workspace } from '../../../../models/workspace.model';
import { CategoryTask } from '../../models/category-task.model';
import { TaskCardComponent } from "./components/task-card/task-card.component";
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksApiService } from '../../services/tasks-api.service';

@Component({
  selector: 'app-category-list',
  imports: [
    MenuModule,
    ButtonModule,
    ModalComponent,
    UpsertTaskComponent,
    TaskCardComponent,
    CdkDropList,
    CdkDrag
],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent {

  public workspace = input.required<Workspace>();
  public category = input.required<Category>();

  private _taskApiService = inject(TasksApiService);
  private _confirmationService = inject(ConfirmationService);

  protected createTaskModal = viewChild<ModalComponent>('createTask');
  protected countedTasks = computed(() => this.category().tasks?.length ?? 0);

  public onAddTask = output<Category>();
  public onEditCategory = output<Category>();
  public onDeleteCategory = output<Category>();
  
  protected selectedTask = signal<CategoryTask | null>(null);
  protected items: MenuItem[] = [
    {
      label: 'Add Task',
      command: () => {
        this.createTaskModal()?.showModal();
      }
    },
    {
      label: 'Edit',
      command: () => {
        this.onEditCategory.emit(this.category());
      }
    },
    {
      label: 'Delete',
      command: () => {
        this._confirmationService.confirm({
          message: 'Are you sure you want to delete this category?',
          header: 'Confirmation',
          accept: () => {
            this.onDeleteCategory.emit(this.category());
          }
        });
      }
    }
  ];

  drop(event: CdkDragDrop<any>) {
    const newListUuid = event.container.element.nativeElement.attributes.getNamedItem('data-category')?.value;
    const prevListUuid = event.previousContainer.element.nativeElement.attributes.getNamedItem('data-category')?.value;
    if (event.previousContainer === event.container) {
      this._taskApiService.swapPositionSameCategory(event.container.data[event.previousIndex], event.currentIndex + 1, this.workspace().uuid, this.category().uuid);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this._taskApiService.swapPositionDifferentCategory(event.previousContainer.data[event.previousIndex].uuid, event.currentIndex + 1, this.workspace().uuid, prevListUuid!, newListUuid!);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    }
  }

  deleteTask(task: CategoryTask) {
    this._taskApiService.delete(task.uuid, this.workspace().uuid, this.category().uuid);
  }
}
