import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorFormTextComponent } from '../../../../../../../../../../shared/components/error-form-text/error-form-text.component';
import { TasksApiService } from '../../../../services/tasks-api.service';
import { Workspace } from '../../../../../../models/workspace.model';
import { Category } from '../../../../models/category.model';
import { CategoryTask, Priority } from '../../../../models/category-task.model';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-upsert-task',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ErrorFormTextComponent,
    SelectModule
  ],
  templateUrl: './upsert-task.component.html',
  styleUrl: './upsert-task.component.scss'
})
export class UpsertTaskComponent {

  private _taskService = inject(TasksApiService);

  public workspace = input.required<Workspace>();
  public category = input.required<Category>();

  public updateTask = input<CategoryTask | null>();
  public onChange = output();

  protected priorityItems = Object.values(Priority);
  protected loading = signal(false);
  protected formGroup = new FormGroup({
    uuid: new FormControl<string>(''),
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    priority: new FormControl<Priority>(Priority.low, [Validators.required]),
    dueDate: new FormControl<Date | null>(null),
  })
  
  constructor() {
    effect(() => {
      if (this.updateTask()) {
        setTimeout(() => {
          this.formGroup.patchValue(this.updateTask()!);
        })
      }
    })
  }

  reset() {
    this.formGroup.reset();
    this.formGroup.patchValue({
      priority: Priority.low
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const uuid = this.formGroup.value.uuid;
    const value = {
      ...this.formGroup.value,
      dueDate: this.formGroup.value.dueDate ? this.formGroup.value.dueDate.toString() : null,
    }
    this.loading.set(true);
    if (uuid) {
      this._taskService.update(uuid, this.formGroup.value, this.workspace().uuid, this.category().uuid).then(() => {
        this.reset();
        this.onChange.emit();
        this.loading.set(false);
      }).catch((error) => {
        this.loading.set(false);
      });
    } else {
      this._taskService.create(this.formGroup.value, this.category().tasks?.length ?? 1, this.workspace().uuid, this.category().uuid).then(() => {
        this.reset();
        this.onChange.emit();
        this.loading.set(false);
      }).catch((error) => {
        this.loading.set(false);
      });
    }
  }
}
