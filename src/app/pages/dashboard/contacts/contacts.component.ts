import { Component, ElementRef, ViewChild } from '@angular/core';
import { ContactService, IContact } from '../../../services/firebase/firestore/contacts.service';
import { CommonModule } from '@angular/common';
import { generateUserAvatar } from '../../../shared/utils/user-utils';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {
  constructor(private contactsService: ContactService) {}
  generateUserAvatar = (k: string | null) => generateUserAvatar(k as string);

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  contacts: IContact[] | null = [];
  contactsDisplayed: IContact[] | null = [];

  private _searchKeyword: string = '';
  get searchKeyword(): string {
    return this._searchKeyword;
  }
  set searchKeyword(value: string) {
    this._searchKeyword = value;

    if (this.searchKeyword) {
      this.contactsDisplayed = this.contacts?.filter((contact) =>
        contact.email?.toLowerCase().includes(this.searchKeyword.toLowerCase()),
      ) as IContact[];
    } else {
      this.contactsDisplayed = this.contacts;
    }
  }

  async loadContacts() {
    this.contacts = await this.contactsService.getContacts();
    this.contactsDisplayed = this.contacts;
  }

  focusSearch() {
    this.searchInputRef.nativeElement.focus();
  }

  ngOnInit() {
    this.loadContacts();
  }
}
