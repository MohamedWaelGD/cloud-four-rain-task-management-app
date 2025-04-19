import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorFormTextComponent } from '../../../../../../../../shared/components/error-form-text/error-form-text.component';
import { CategoryApiService } from '../../services/category-api.service';
import { Category } from '../../models/category.model';
import { Workspace } from '../../../../models/workspace.model';

@Component({
  selector: 'app-upsert-category',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ErrorFormTextComponent,
  ],
  templateUrl: './upsert-category.component.html',
  styleUrl: './upsert-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertCategoryComponent {
  private _categoryService = inject(CategoryApiService);

  public workspace = input.required<Workspace>();
  public updateCategory = input<Category | null>();

  public onChange = output();

  protected loading = signal(false);
  protected formGroup = new FormGroup({
    uuid: new FormControl<string>(''),
    name: new FormControl<string>('', [Validators.required]),
  });

  constructor() {
    effect(() => {
      if (this.updateCategory()) {
        this.formGroup.patchValue(this.updateCategory()!);
      }
    });
  }

  reset() {
    this.formGroup.reset();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const uuid = this.formGroup.value.uuid;
    this.loading.set(true);
    if (uuid) {
      this._categoryService
        .update(uuid, this.formGroup.value, this.workspace().uuid)
        .then(() => {
          this.onChange.emit();
          this.formGroup.reset();
          this.loading.set(false);
        })
        .catch(() => {
          this.loading.set(false);
          this.loading.set(false);
        });
    } else {
      this._categoryService
        .create(this.formGroup.value, this.workspace().uuid)
        .then(() => {
          this.onChange.emit();
          this.formGroup.reset();
          this.loading.set(false);
        })
        .catch(() => {
          this.loading.set(false);
        });
    }
  }
}
