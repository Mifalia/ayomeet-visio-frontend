import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './services/guards/auth.guard';
import { LogoutComponent } from './pages/logout/logout.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
];
