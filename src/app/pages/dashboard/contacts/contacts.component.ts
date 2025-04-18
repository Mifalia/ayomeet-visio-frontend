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

  showNewContactForm: boolean = false;
  isLoadingNewContact: boolean = false;

  toggleNewContactForm() {
    this.showNewContactForm = !this.showNewContactForm;
  }

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  contacts: IContact[] | null = [];
  contactsDisplayed: IContact[] | null = [];

  newContactEmail: string = '';

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

  async submitNewContact() {
    const email = this.newContactEmail.trim();
    if (!email) return;
    this.isLoadingNewContact = true;
    const existingContact = this.contacts?.find((contact) => contact.email === email);
    if (existingContact) {
      alert('Contact already exists');
      this.isLoadingNewContact = false;
      return;
    }
    const newContact: IContact = {
      email,
    };
    await this.contactsService.addContact(newContact);
    this.newContactEmail = '';
    this.showNewContactForm = false;
    this.loadContacts();
    this.isLoadingNewContact = false;
  }

  deleteContact(id: string | undefined) {
    confirm('Are you sure you want to delete this contact?') &&
      this.contactsService.deleteContact(id as string).then(() => {
        this.loadContacts();
      });
  }

  editContact(id: string | undefined) {
    const contact = this.contacts?.find((contact) => contact.id === id);
    if (!contact) return;
    let email = prompt(`Edit ${contact.email}`, contact?.email as string);
    email = email?.trim() as string;
    if (!email) return;
    this.contactsService.updateContact(id as string, { email }).then(() => {
      this.loadContacts();
    });
  }

  focusSearch() {
    this.searchInputRef.nativeElement.focus();
  }

  ngOnInit() {
    this.loadContacts();
  }
}
