import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { WorkspaceApiService } from '../../services/workspace-api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Workspace } from '../../models/workspace.model';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { UpsertCategoryComponent } from './components/upsert-category/upsert-category.component';
import { Category } from './models/category.model';
import { Subscription, switchMap, take, tap } from 'rxjs';
import { CategoryApiService } from './services/category-api.service';
import { CategoryListComponent } from "./components/category-list/category-list.component";
import { MessageService } from 'primeng/api';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  imports: [
    ButtonModule,
    DialogModule,
    ModalComponent,
    UpsertCategoryComponent,
    CategoryListComponent,
    CdkDropListGroup,
    RouterLink,
    ProgressSpinnerModule,
    CommonModule
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit, OnDestroy {
  private _activatedRoute = inject(ActivatedRoute);
  private _workspaceService = inject(WorkspaceApiService);
  private _categoriesService = inject(CategoryApiService);
  private _messageService = inject(MessageService);

  protected workspace = signal<Workspace | null>(null);
  protected categories = signal<Category[]>([]);
  protected sortedCategories = computed(() => this.categories().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  protected selectedCategory = signal<Category | null>(null);
  protected loading = signal(false);
  
  protected categoriesSubs!: Subscription;

  ngOnInit(): void {
    this.loading.set(true);
    const uuid = this._activatedRoute.snapshot.paramMap.get('uuid') as string;
    this._workspaceService
      .get(uuid)
      .pipe(
        tap((workspace) => this.workspace.set(workspace)),
        take(1)
      )
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.getCategories(this.workspace()!);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  ngOnDestroy(): void {
    this.categoriesSubs.unsubscribe();
  }

  getCategories(workspace: Workspace) {
    this.loading.set(true);
    this.categoriesSubs = this._categoriesService
      .getAll(workspace.uuid)
      .pipe(tap((categories) => this.categories.set(categories))).subscribe({
        next: (c) => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  deleteCategory(category: Category) {
    this._categoriesService
      .delete(category.uuid, this.workspace()?.uuid!)
      .then(() => {
        this._messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Category deleted successfully',
        });
        this.categories.update((prev) => prev.filter((c) => c.uuid !== category.uuid));
      })
      .catch(() => {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting category',
        });
      });
  }
}
