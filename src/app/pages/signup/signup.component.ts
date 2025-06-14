import { Component, inject } from '@angular/core';
import { AuthlayoutComponent } from '../../shared/layouts/authlayout/authlayout.component';
import { AuthService } from '../../services/firebase/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { extractUsernameFromEmail, generateUserAvatar } from '../../shared/utils/user-utils';
import { IUserSession, SessionService } from '../../services/session/session.service';
import { ContactService } from '../../services/firebase/firestore/contacts.service';

@Component({
  selector: 'app-signup',
  imports: [AuthlayoutComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private contactService: ContactService) {}

  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  sessionService: SessionService = inject(SessionService);

  username: string = '';
  email: string = '';
  password: string = '';
  passwordConfirm: string = '';

  message: string = '';

  getAlertClass() {
    return this.message ? 'visible' : 'invisible';
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.message = '';

    if (!this.email.trim() || !this.password.trim() || !this.username.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (this.password !== this.passwordConfirm) {
        throw new Error('Passwords do not match');
      }

      const response = await this.authService.signup({
        email: this.email,
        password: this.password,
        username: this.username,
      });
      const userToken = await response.user.getIdToken();
      const user: IUserSession = {
        uid: response.user.uid,
        token: userToken,
        email: response.user.email,
        username: response.user.displayName || extractUsernameFromEmail(response.user.email as string),
        avatar: response.user.photoURL || generateUserAvatar(response.user.email as string),
      };
      // open user session
      this.sessionService.setUser(user);
      // redirect home
      await this.contactService.initializeContactsCollection();

      this.router.navigateByUrl('/');
    } catch (error: any) {
      this.message = error.message;
    }
  }
}
