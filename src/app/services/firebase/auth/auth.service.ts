import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { generateUserAvatar } from '../../../shared/utils/user-utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

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

  /**
   * Signs up a new user with the provided email and password.
   *
   * This method uses Firebase Authentication to create a new user account.
   * If the operation is successful, it returns the response from Firebase.
   * If an error occurs, it throws a specific error message based on the error code.
   *
   * @param email - The email address of the user to sign up.
   * @param password - The password for the new user account.
   * @returns A promise that resolves with the response from Firebase upon successful account creation.
   * @throws {Error} If the email is already in use, invalid, or the password is too weak.
   * @throws {Error} If an unexpected error occurs during the signup process.
   */
  public async signup({ username, email, password }: { username: string; email: string; password: string }) {
    try {
      const createUser = await createUserWithEmailAndPassword(this.auth, email, password);
      const updateUser = await updateProfile(createUser.user, {
        displayName: username,
        photoURL: generateUserAvatar(email),
      });
      const logUser = await signInWithEmailAndPassword(this.auth, email, password);
      return logUser;
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            throw new Error('This email is already in use');
          case 'auth/invalid-email':
            throw new Error('Please check your email address format');
          case 'auth/weak-password':
            throw new Error('Password should be at least 6 characters long');
          default:
            throw new Error('Oops, something went wrong.');
        }
      }

      throw new Error('Oops, something went wrong.');
    }
  }
}
