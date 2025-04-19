import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _auth = inject(Auth);
  private _user = signal<User | null>(null);

  get user() {
    return this._user.asReadonly();
  }

  get currentUser() {
    return this._user;
  }

  constructor() {
    this._auth.onAuthStateChanged((user) => {
      if (user) {
        this._user.set(user);
      } else {
        this._user.set(null);
      }
    });
  }

  async register(email: string, password: string, displayName: string) {
    const userCredential = await createUserWithEmailAndPassword(
      this._auth,
      email,
      password
    );
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
    }
    return userCredential;
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  logout() {
    return signOut(this._auth);
  }
}
