import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { WorkspaceApiService } from './services/workspace-api.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { UpsertWorkspaceComponent } from './components/upsert-workspace/upsert-workspace.component';
import { Workspace } from './models/workspace.model';
import { WorkspaceCardComponent } from './components/workspace-card/workspace-card.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription, take } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ModalComponent } from "../../../../shared/components/modal/modal.component";

@Component({
  selector: 'app-workspaces',
  imports: [
    ButtonModule,
    DialogModule,
    FormsModule,
    UpsertWorkspaceComponent,
    WorkspaceCardComponent,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ModalComponent
],
  templateUrl: './workspaces.component.html',
  styleUrl: './workspaces.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspacesComponent implements OnInit, OnDestroy {
  private _workspacesService = inject(WorkspaceApiService);
  private _confirmationService = inject(ConfirmationService);
  private _messageService = inject(MessageService);

  protected selectedWorkspace = signal<Workspace | null>(null);
  protected workspaces = signal<Workspace[]>([]);
  protected workspacesSorted = computed(() => this.workspaces().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  protected workspaceSubscription!: Subscription;
  protected loading = signal(true);

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.workspaceSubscription.unsubscribe();
  }

  getData() {
    this.loading.set(true);
    this.workspaceSubscription = this._workspacesService.getAll().subscribe({
      next: (workspaces) => {
        this.workspaces.set(workspaces);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  deleteWorkspace(workspace: Workspace) {
    this._confirmationService.confirm({
      header: 'Confirmation',
      message: 'Are you sure you want to delete this workspace?',
      accept: () => {
        this._workspacesService.delete(workspace.uuid).then(() => {
          this.getData();
          this._messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Workspace deleted successfully',
          });
        });
      },
    });
  }
}
