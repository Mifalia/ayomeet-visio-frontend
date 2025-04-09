import { Injectable } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../config';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth;
  constructor() {
    this.auth = getAuth(firebaseApp);
  }

  public async login(email: string, password: string) {
    try {
      const response = await signInWithEmailAndPassword(this.auth, email, password);
      return response;
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            throw new Error('Invalid credentials. Please check your email and password.');
          default:
            throw new Error('Oops, something wrong happened.');
        }
      }
      // Handle other types of errors
      // For example, network errors or unexpected errors
      throw new Error('Oops, something wrong happened.');
    }
  }
}
