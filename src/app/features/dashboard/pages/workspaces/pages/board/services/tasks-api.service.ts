import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../../../../../core/services/authentication/authentication.service';
import { CategoryTask } from '../models/category-task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksApiService {
  private _firestore = inject(Firestore);
  private _authService = inject(AuthenticationService);

  async create(
    newTaskData: any,
    index: number,
    workspaceUuid: string,
    categoryUuid: string
  ) {
    const ref = `workspaces/${workspaceUuid}/categories/${categoryUuid}/tasks`;
    const colRef = collection(this._firestore, ref);
    const q = query(colRef, orderBy('position'));
    const user = this._authService.currentUser;

    const snapshot = await getDocs(q);
    const batch = writeBatch(this._firestore);

    snapshot.docs.forEach((docSnap, i) => {
      if (i >= index) {
        const docRef = doc(this._firestore, ref, docSnap.id);
        batch.update(docRef, { position: i + 1 });
      }
    });

    const newDocRef = doc(collection(this._firestore, ref));
    batch.set(newDocRef, {
      ...newTaskData,
      position: index,
      createdAt: new Date().toString(),
      createdBy: user()?.uid!,
    });

    await batch.commit();
  }

  async swapPositionSameCategory(
    taskData: any,
    newIndex: number,
    workspaceUuid: string,
    categoryUuid: string
  ) {
    const ref = `workspaces/${workspaceUuid}/categories/${categoryUuid}/tasks`;
    const colRef = collection(this._firestore, ref);
    const q = query(colRef, orderBy('position'));

    const snapshot = await getDocs(q);
    const batch = writeBatch(this._firestore);

    let index = 1;
    snapshot.docs.forEach((docSnap, i) => {
      const docRef = doc(this._firestore, ref, docSnap.id);
      if (docSnap.id !== taskData.uuid) {
        if (index >= newIndex) {
          index++;
          batch.update(docRef, { position: index + 1 });
        } else {
          batch.update(docRef, { position: index++ });
        }
      }
    });

    const newDocRef = doc(collection(this._firestore, ref), taskData.uuid);
    batch.update(newDocRef, {
      position: newIndex,
    });

    await batch.commit();
  }

  async swapPositionDifferentCategory(
    taskId: string,
    insertIndex: number,
    workspaceUuid: string,
    oldCategoryUuid: string,
    newCategoryUuid: string
  ) {
    const fromPath = `workspaces/${workspaceUuid}/categories/${oldCategoryUuid}/tasks`;
    const toPath = `workspaces/${workspaceUuid}/categories/${newCategoryUuid}/tasks`;

    const fromRef = doc(this._firestore, fromPath, taskId);
    const toColRef = collection(this._firestore, toPath);

    const taskSnap = await getDoc(fromRef);
    if (!taskSnap.exists())
      throw new Error('Task not found in source category');

    const taskData = taskSnap.data();

    const destSnap = await getDocs(query(toColRef, orderBy('position')));
    const destTasks = destSnap.docs;

    const batch = writeBatch(this._firestore);

    let index = 1;
    destTasks.forEach((docSnap, i) => {
      const destDocRef = doc(this._firestore, toPath, docSnap.id);
      if (index >= insertIndex) {
        index++;
        batch.update(destDocRef, { position: index + 1 });
      } else {
        batch.update(destDocRef, { position: index++ });
      }
    });

    const movedDocRef = doc(this._firestore, toPath, taskId);
    const updatedTask = {
      ...taskData,
      categoryId: newCategoryUuid,
      position: insertIndex,
    };
    batch.set(movedDocRef, updatedTask);

    batch.delete(fromRef);

    await batch.commit();
  }

  getAll(workspaceUuid: string, categoryUuid: string) {
    const col = collection(
      this._firestore,
      `workspaces/${workspaceUuid}/categories/${categoryUuid}/tasks`
    );
    return collectionData(col, { idField: 'uuid' }) as Observable<
      CategoryTask[]
    >;
  }

  get(docId: string, workspaceUuid: string, categoryUuid: string) {
    const docRef = doc(
      this._firestore,
      `workspaces/${workspaceUuid}/categories/${categoryUuid}/tasks/${docId}`
    );
    return docData(docRef, { idField: 'uuid' }) as Observable<CategoryTask>;
  }

  async update(
    docId: string,
    data: any,
    workspaceUuid: string,
    categoryUuid: string
  ) {
    const docRef = doc(
      this._firestore,
      `workspaces/${workspaceUuid}/categories/${categoryUuid}/tasks/${docId}`
    );
    await updateDoc(docRef, data);
  }

  async delete(docId: string, workspaceUuid: string, categoryUuid: string) {
    const docRef = doc(
      this._firestore,
      `workspaces/${workspaceUuid}/categories/${categoryUuid}/tasks/${docId}`
    );
    await deleteDoc(docRef);
  }
}
