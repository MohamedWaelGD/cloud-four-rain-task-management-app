import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Workspace } from '../../models/workspace.model';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ShortTextPipe } from "../../../../../../shared/pipes/short-text/short-text.pipe";

@Component({
  selector: 'app-workspace-card',
  imports: [ButtonModule, MenuModule, CommonModule, ShortTextPipe],
  templateUrl: './workspace-card.component.html',
  styleUrl: './workspace-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceCardComponent {
  private _router = inject(Router);

  public workspace = input.required<Workspace>();

  public onDelete = output<Workspace>();
  public onEdit = output<Workspace>();
  protected items: MenuItem[] = [
    {
      label: 'Go to board',
      command: () => {
        this._router.navigate([`/dashboard/workspaces/${this.workspace().uuid}/board`]);
      },
    },
    {
      label: 'Edit',
      command: () => {
        this.onEdit.emit(this.workspace());
      },
    },
    {
      label: 'Delete',
      command: () => {
        this.onDelete.emit(this.workspace());
      },
    },
  ];
}
