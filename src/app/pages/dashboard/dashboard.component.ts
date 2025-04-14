import { Component, inject, OnInit } from '@angular/core';
import { IUserSession, SessionService } from '../../services/session/session.service';
import { DashboardLayoutComponent } from '../../shared/layout/dashboard-layout/dashboard-layout.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [DashboardLayoutComponent, RouterLink],
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  sessionService: SessionService = inject(SessionService);
  user: IUserSession | null = null;

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
  }
}
