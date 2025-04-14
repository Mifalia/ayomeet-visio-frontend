import { Component, inject } from '@angular/core';
import { IUserSession, SessionService } from '../../../services/session/session.service';

@Component({
  selector: 'app-dashboard-header',
  imports: [],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
})
export class DashboardHeaderComponent {
  sessionService: SessionService = inject(SessionService);
  user: IUserSession | null = this.sessionService.getUser();
}
