import { Component, inject } from '@angular/core';
import { AuthlayoutComponent } from '../../shared/layouts/authlayout/authlayout.component';
import { AuthService } from '../../services/firebase/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { extractUsernameFromEmail } from '../../shared/utils/user-utils';
import { IUserSession, SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-signup',
  imports: [AuthlayoutComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  sessionService: SessionService = inject(SessionService);
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

    if (!this.email.trim() || !this.password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (this.password !== this.passwordConfirm) {
        throw new Error('Passwords do not match');
      }

      const response = await this.authService.signup(this.email, this.password);
      const userToken = await response.user.getIdToken();
      const user: IUserSession = {
        token: userToken,
        email: response.user.email,
        username: extractUsernameFromEmail(response.user.email as string),
      };
      // open user session
      this.sessionService.setUser(user);
      // redirect home
      this.router.navigateByUrl('/');
    } catch (error: any) {
      this.message = error.message;
    }
  }
}
