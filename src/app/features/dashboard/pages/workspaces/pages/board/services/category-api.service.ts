import { inject, Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { AuthenticationService } from '../../../../../../../core/services/authentication/authentication.service';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { v4 } from 'uuid';
import { CategoryTask } from '../models/category-task.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private _firestore = inject(Firestore);
  private _authService = inject(AuthenticationService);

  async create(data: any, workspaceUuid: string): Promise<void> {
    const col = collection(
      this._firestore,
      `workspaces/${workspaceUuid}/categories`
    );
    const user = this._authService.currentUser;

    const category: Category = {
      ...data,
      createdAt: new Date().toString(),
      createdBy: user()?.uid!,
    };

    await addDoc(col, category);
  }

  getAll(workspaceUuid: string) {
    const col = collection(
      this._firestore,
      `workspaces/${workspaceUuid}/categories`
    );
    return (
      collectionData(col, { idField: 'uuid' }) as Observable<Category[]>
    ).pipe(
      switchMap((categories) => {
        if (categories.length === 0) return of([]);

        const tasks$ = categories.map((category) => {
          const taskCol = collection(
            this._firestore,
            `workspaces/${workspaceUuid}/categories/${category.uuid}/tasks`
          );
          return (collectionData(taskCol, { idField: 'uuid' }) as Observable<CategoryTask[]>).pipe(
            map((tasks) => ({ ...category, tasks: tasks.sort((a, b) => a.position - b.position) }))
          );
        });

        return combineLatest(tasks$);
      })
    );
  }

  get(docId: string, workspaceUuid: string) {
    const docRef = doc(
      this._firestore,
      `workspaces/${workspaceUuid}/categories/${docId}`
    );
    return docData(docRef, { idField: 'uuid' }) as Observable<Category>;
  }

  async update(docId: string, data: any, workspaceUuid: string) {
    const docRef = doc(
      this._firestore,
      `workspaces/${workspaceUuid}/categories/${docId}`
    );
    await updateDoc(docRef, data);
  }

  async delete(docId: string, workspaceUuid: string) {
    const docRef = doc(
      this._firestore,
      `workspaces/${workspaceUuid}/categories/${docId}`
    );
    await deleteDoc(docRef);
  }
}
