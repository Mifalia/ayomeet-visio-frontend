import { Component, inject } from '@angular/core';
import { AuthlayoutComponent } from '../../shared/layouts/authlayout/authlayout.component';
import { AuthService } from '../../../services/firebase/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [AuthlayoutComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  authService: AuthService = inject(AuthService);
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
    } catch (error: any) {
      this.message = error.message;
    }
  }
}
