import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-logout',
  imports: [],
  template: '',
})
export class LogoutComponent {
  router: Router = inject(Router);
  sessionService: SessionService = inject(SessionService);

  constructor() {
    this.sessionService.clear();
    this.router.navigate(['/login']);
  }
}
