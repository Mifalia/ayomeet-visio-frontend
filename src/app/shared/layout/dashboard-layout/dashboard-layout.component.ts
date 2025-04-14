import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterLink, CommonModule, DashboardHeaderComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  sidebarMenuLinks: ISidebarLink[] = [
    {
      href: '/meeting',
      label: 'Meeting',
      icon: 'videocam',
    },
    {
      href: '/contacts',
      label: 'Contacts',
      icon: 'contacts',
    },
  ];
}

interface ISidebarLink {
  href?: string;
  label?: string;
  icon?: string;
}
