import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { v4 } from 'uuid';
import { Observable } from 'rxjs';
import { Workspace } from '../models/workspace.model';
import { AuthenticationService } from '../../../../../core/services/authentication/authentication.service';
import { GenericApi } from '../../../../../core/classes/generic-api';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceApiService {
  private _firestore = inject(Firestore);
  private _authService = inject(AuthenticationService);

  private workspacesRef = collection(this._firestore, 'workspaces');
  async create(data: any): Promise<void> {
    const user = this._authService.currentUser;

    const workspace: Workspace = {
      ...data,
      createdAt: new Date().toString(),
      createdBy: user()?.uid!,
    };

    await addDoc(this.workspacesRef, workspace);
  }

  getAll() {
    const q = query(this.workspacesRef, where('createdBy', '==', this._authService.currentUser()?.uid!));
    return collectionData(q, { idField: 'uuid' }) as Observable<Workspace[]>;
  }

  get(docId: string) {
    const docRef = doc(this._firestore, `workspaces/${docId}`);
    return docData(docRef, { idField: 'uuid' }) as Observable<Workspace>;
  }

  async update(docId: string, data: any) {
    const docRef = doc(this._firestore, `workspaces/${docId}`);
    await updateDoc(docRef, data);
  }

  async delete(docId: string) {
    const docRef = doc(this._firestore, `workspaces/${docId}`);
    await deleteDoc(docRef);
  }
}
