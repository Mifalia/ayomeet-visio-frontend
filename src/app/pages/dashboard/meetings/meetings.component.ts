import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ContactService } from '../../../services/firebase/firestore/contacts.service';
import { generateUserAvatar } from '../../../shared/utils/user-utils';
import { TwilioVideoService } from '../../../services/twilio/twilio.service';
import { Router } from '@angular/router';
import { generateRoomName, isValidRoomName } from '../../../shared/utils/room-utils';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meetings',
  imports: [CommonModule, FormsModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css',
})
export class MeetingsComponent implements OnInit {
  constructor(
    private contactService: ContactService,
    private videoService: TwilioVideoService,
  ) {}

  router: Router = inject(Router);

  activeTab: 'join' | 'create' = 'join';

  switchTab(tabId: 'join' | 'create'): void {
    this.activeTab = tabId;
  }

  isActive(tabId: 'join' | 'create'): boolean {
    return this.activeTab === tabId;
  }

  contacts: any = [];

  async loadContacts() {
    try {
      this.contacts = await this.contactService.getContacts();
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  generateUserAvatar = (k: string | null) => generateUserAvatar(k as string);

  joinRoomName: string = '';
  createRoomName: string = '';

  joinRoom(e: Event) {
    e.preventDefault();
    if (!this.joinRoomName.trim()) return;
    if (!isValidRoomName(this.joinRoomName)) {
      alert('Invalid room name. Wether check the room name, or join directly by a shared link.');
    }
    this.router.navigate([`/meeting/${this.joinRoomName}`]);
  }

  createRoom(e: Event) {
    e.preventDefault();
    if (!this.createRoomName.trim()) return;
    const generatedRoomName = generateRoomName(this.createRoomName);
    this.router.navigate([`/meeting`, generatedRoomName]);
  }

  ngOnInit(): void {
    this.loadContacts();
  }
}
