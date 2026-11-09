import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingStatusService {

  private baseUrl = environment.apiUrl;

  private bookingstatus: string = `${this.baseUrl}/bookingstatus`

  constructor(
    private http: HttpClient
  ) { }

  listBookingStatus(): Observable<any> {
    return this.http.get(this.bookingstatus)
  }
}
