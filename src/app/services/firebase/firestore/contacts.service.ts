import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentData,
  serverTimestamp,
  FieldValue,
} from '@angular/fire/firestore';

import { IUserSession, SessionService } from '../../session/session.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(
    private firestore: Firestore,
    private sessionService: SessionService,
  ) {}

  private get currentUser(): IUserSession | null {
    return this.sessionService.getUser();
  }

  private getContactsCollection(): CollectionReference<DocumentData> {
    if (!this.currentUser) throw new Error('Utilisateur non connecté');

    return collection(this.firestore, `users/${this.currentUser.uid}/contacts`);
  }

  async getContacts(): Promise<any[]> {
    const contactsRef = this.getContactsCollection();
    const snapshot = await getDocs(contactsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async addContact(extraData: Partial<IContact> = {}): Promise<void> {
    const contactRef = doc(this.firestore, `users/${this.currentUser?.uid}/contacts/${crypto.randomUUID()}`);
    await setDoc(contactRef, {
      createdAt: serverTimestamp(),
      ...extraData,
    });
  }

  async updateContact(contactUserId: string, data: any): Promise<void> {
    const contactRef = doc(this.firestore, `users/${this.currentUser?.uid}/contacts/${contactUserId}`);
    await updateDoc(contactRef, data);
  }

  async deleteContact(contactUserId: string): Promise<void> {
    const contactRef = doc(this.firestore, `users/${this.currentUser?.uid}/contacts/${contactUserId}`);
    await deleteDoc(contactRef);
  }

  async initializeContactsCollection(): Promise<void> {
    if (!this.currentUser) throw new Error('Utilisateur non connecté');

    const contactsRef = this.getContactsCollection();
    const snapshot = await getDocs(contactsRef);

    if (snapshot.empty) {
      const initialContactRef = doc(this.firestore, `users/${this.currentUser.uid}/contacts/${crypto.randomUUID()}`);
      await setDoc(initialContactRef, {
        email: this.currentUser.email,
        createdAt: serverTimestamp(),
      } as IContact);
    }
  }
}

export interface IContact {
  email: string | null;
  createdAt?: any;
}
