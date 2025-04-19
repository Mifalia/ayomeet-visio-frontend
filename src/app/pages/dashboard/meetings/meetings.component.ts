import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../services/firebase/firestore/contacts.service';
import { generateUserAvatar } from '../../../shared/utils/user-utils';

@Component({
  selector: 'app-meetings',
  imports: [CommonModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css',
})
export class MeetingsComponent implements OnInit {
  constructor(private contactService: ContactService) {}

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

  ngOnInit(): void {
    this.loadContacts();
  }
}
