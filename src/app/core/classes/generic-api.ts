import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Observable } from 'rxjs';
import { Workspace } from '../../features/dashboard/pages/workspaces/models/workspace.model';
import { v4 } from 'uuid';

export class GenericApi<T> {
  private ref: CollectionReference<any, any>;

  constructor(
    private _firestore: Firestore,
    private _authService: AuthenticationService,
    private _collectionName: string
  ) {
    this.ref = collection(this._firestore, this._collectionName);
  }

  async create(data: any): Promise<void> {
    const uuid = v4();
    const user = this._authService.currentUser;

    const _data: any = {
      ...data,
      uuid,
      createdAt: new Date(),
      createdBy: user()?.uid!,
    };

    await addDoc(this.ref, _data);
  }
  getAll() {
    return collectionData(this.ref, {
      idField: 'uuid',
    }) as Observable<T[]>;
  }

  get(docId: string) {
    const docRef = doc(this._firestore, `${this._collectionName}/${docId}`);
    return docData(docRef, { idField: 'uuid' }) as Observable<T>;
  }

  async update(docId: string, data: any) {
    const docRef = doc(this._firestore, `${this._collectionName}/${docId}`);
    await updateDoc(docRef, data);
  }

  async delete(docId: string) {
    const docRef = doc(this._firestore, `${this._collectionName}/${docId}`);
    await deleteDoc(docRef);
  }
}
