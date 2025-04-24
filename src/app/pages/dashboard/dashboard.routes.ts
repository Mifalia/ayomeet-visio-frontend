import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactsComponent } from './contacts/contacts.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { RoomComponent } from './meetings/room/room.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'contacts',
    component: ContactsComponent,
  },
  {
    path: 'meeting',
    component: MeetingsComponent,
  },
  {
    path: 'meeting/:room_name',
    component: RoomComponent,
  },
];
