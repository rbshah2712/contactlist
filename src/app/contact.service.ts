import { Injectable } from '@angular/core';
import { Contact } from './contact/contact';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  apiUrl = 'http://localhost:3000/contacts';

  constructor(private http:HttpClient) { }

  //retrieve contacts

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  //create contact
  createContact(item: Contact): Observable<Contact> {
      // Ensure the name field is provided
      if (!item.firstname) {
        return throwError("FirstName field is required.");
      }
      if (!item.phonenumber) {
        return throwError("Phone Number field is required.");
      }
  
      // Create a new object without _id
      const { _id, ...newContact } = item;
  
      return this.http.post<Contact>(this.apiUrl, newContact).pipe(
        catchError((error: any) => {
          return throwError("Failed to create contact.");
        })
      );
    }

  
      // UPDATE an existing item
  updateContact(id: string, item: Contact): Observable<any> {
    console.log('Updating contact with ID:', id, 'and data:', item); // Log for debugging
  
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, item).pipe(
      catchError((error: any) => {
        console.error('Error updating item:', error); // Log error for debugging
        return throwError("Failed to update item."); // Handle error gracefully
      })
    );
  }

  // DELETE an item
  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`); // Fix template string
  }
  
}
