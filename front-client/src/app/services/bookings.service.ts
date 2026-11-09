import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  private baseUrl = environment.apiUrl;

  private bookings: string = `${this.baseUrl}/bookings`

  constructor(
    private http: HttpClient
  ) { }

  listBookings(): Observable<any> {
    return this.http.get(this.bookings)
  }

  listBookingsByUser(id: number): Observable<any> {
    return this.http.get(`${this.bookings}/find/${id}`)
  }

  getBookingById(id: number): Observable<any> {
    return this.http.get(`${this.bookings}/${id}`)
  }

  createBooking(request: any): Observable<any> {
    return this.http.post(`${this.bookings}`, request)
  }

  updateBooking(id: number, request: any): Observable<any> {
    return this.http.put(`${this.bookings}/${id}`, request)
  }

  cancelBooking(id: number, request: null): Observable<any> {
    return this.http.put(`${this.bookings}/cancel/${id}`, request)
  }

}