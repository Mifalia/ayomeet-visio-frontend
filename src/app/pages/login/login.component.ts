import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthlayoutComponent } from '../../shared/layouts/authlayout/authlayout.component';
import { AuthService } from '../../../services/firebase/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [AuthlayoutComponent, FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginPage {
  authService: AuthService = inject(AuthService);
  email: string = '';
  password: string = '';
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
      const response = await this.authService.login(this.email, this.password);
    } catch (error: any) {
      this.message = error.message;
    }
  }
}
