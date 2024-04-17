import { Component } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from './contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {


  contacts: Contact[] = [];
  newContact: Contact = { _id: '', firstname: '', lastname: '', phonenumber: '' };
  editableItemId: string | null = null;
  isEditMode: boolean = false;


  constructor(private contactservice: ContactService) {}
  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    this.contactservice.getContacts().subscribe(contacts => {
      this.contacts = contacts.filter(item => !!item._id);
    });
  }

  editOrUpdateContact(): void {
    if (this.isEditMode) {
      this.contactservice.updateContact(this.newContact._id, this.newContact)
        .subscribe(updatedItem => {
          const index = this.contacts.findIndex(i => i._id === updatedItem._id);
          if (index !== -1) {
            this.contacts[index] = updatedItem;
          } else {
            console.error('Item not found in items array');
          }
          this.resetForm();
          this.isEditMode = false;
        }, error => {
          console.error('Error updating item:', error);
        });
    } else {
      if (!this.newContact._id) {
        this.newContact._id = this.generateRandomId();
      }

      this.contactservice.createContact(this.newContact)
        .subscribe(item => {
          this.contacts.push(item);
          this.resetForm();
        });
    }
  }

  deleteContact(id: string): void {
    this.contactservice.deleteContact(id)
      .subscribe(() => {
        const index = this.contacts.findIndex(i => i._id === id);
        this.contacts.splice(index, 1);
      });
  }

  editContact(item: Contact): void {
    this.isEditMode = true;
    this.newContact = { ...item }; // Copy the item to newItem
  }

  cancelEdit(): void {
    this.resetForm();
    this.isEditMode = false;
  }

  resetForm(): void {
    this.newContact = { _id: '', firstname: '', lastname: '', phonenumber: '' };
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
