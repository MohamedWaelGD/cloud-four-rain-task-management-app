import { Component, inject, input, output } from '@angular/core';
import { CategoryTask } from '../../../../models/category-task.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ShortTextPipe } from "../../../../../../../../../../shared/pipes/short-text/short-text.pipe";

@Component({
  selector: 'app-task-card',
  imports: [DatePipe, MenuModule, ButtonModule, CommonModule, ShortTextPipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  private _confirmationService = inject(ConfirmationService);
  
  public onEditTask = output<CategoryTask>();
  public onDeleteTask = output<CategoryTask>();

  public categoryTask = input.required<CategoryTask>();
  protected items: MenuItem[] = [
    {
      label: 'Edit',
      command: () => {
        this.onEditTask.emit(this.categoryTask());
      },
    },
    {
      label: 'Delete',
      command: () => {
        this._confirmationService.confirm({
          message: 'Are you sure you want to delete this task?',
          header: 'Confirmation',
          accept: () => {
            this.onDeleteTask.emit(this.categoryTask());
          },
        });
      },
    },
  ];
}
