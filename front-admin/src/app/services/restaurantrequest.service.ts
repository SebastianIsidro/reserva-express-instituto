import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantrequestService {

  private baseUrl = environment.apiUrl;

  private restaurantsrequest: string = `${this.baseUrl}/restaurantsrequest`

  constructor(
    private http: HttpClient
  ) { }

  listRestaurantsRequests(): Observable<any> {
    return this.http.get(this.restaurantsrequest)
  }

  declineRestaurantRequest(id: number): Observable<any> {
    return this.http.put(`${this.restaurantsrequest}/decline/${id}`, {});
  }  

  approveRestaurantRequest(id: number): Observable<any> {
    return this.http.put(`${this.restaurantsrequest}/approveRestaurantRequest/${id}`, {});
  }

}
