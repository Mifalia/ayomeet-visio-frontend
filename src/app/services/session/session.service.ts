// session.service.ts
import { Injectable } from '@angular/core';

export interface IUserSession {
  token: string;
  email: string | null;
  username?: string | null;
  avatar?: string | null;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  setUser(user: IUserSession) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): IUserSession | null {
    const userJson = localStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as IUserSession) : null;
  }

  clear() {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
