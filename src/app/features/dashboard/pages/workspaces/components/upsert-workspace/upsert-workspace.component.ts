import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkspaceApiService } from '../../services/workspace-api.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorFormTextComponent } from "../../../../../../shared/components/error-form-text/error-form-text.component";
import { Workspace } from '../../models/workspace.model';
import { pictures } from '../../../../../../core/classes/pictures';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upsert-workspace',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ErrorFormTextComponent,
    CommonModule
],
  templateUrl: './upsert-workspace.component.html',
  styleUrl: './upsert-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertWorkspaceComponent {
  private _workspaceService = inject(WorkspaceApiService);

  public updateWorkspace = input<Workspace | null>();
  public onChange = output();

  protected formGroup = new FormGroup({
    uuid: new FormControl<string>(''),
    name: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    backgroundPath: new FormControl<string>(pictures[0], [Validators.required])
  });
  protected pictures = pictures;
  protected loading = signal(false);

  get selectedBackgroundPath() {
    return this.formGroup.get('backgroundPath')?.value;
  }

  constructor() {
    effect(() => {
      if (this.updateWorkspace()) {
        this.formGroup.patchValue(this.updateWorkspace()!);
      }
    })
  }

  selectPicture(pictureUrl: string) {
    this.formGroup.patchValue({
      backgroundPath: pictureUrl,
    });
  }

  reset() {
    this.formGroup.reset();
    this.formGroup.patchValue({
      'backgroundPath': pictures[0],
    })
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const data = {
      name: this.formGroup.value.name,
      description: this.formGroup.value.description,
      backgroundPath: this.formGroup.value.backgroundPath,
    };
    if (this.formGroup.value.uuid) {
      const uuid = this.formGroup.value.uuid;
      this._workspaceService
        .update(uuid, data)
        .then(() => {
          this.loading.set(false);
          this.reset();
          this.onChange.emit();
        })
        .catch((error) => {
          this.loading.set(false);
        });
    } else {
      this._workspaceService
        .create(data)
        .then(() => {
          this.loading.set(false);
          this.reset();
          this.onChange.emit();
        })
        .catch((error) => {
          this.loading.set(false);
        });
    }
  }
}
