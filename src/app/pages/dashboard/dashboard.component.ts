import { Component } from '@angular/core';
import { DashboardLayoutComponent } from '../../shared/layout/dashboard-layout/dashboard-layout.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [DashboardLayoutComponent, RouterLink, RouterOutlet],
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
