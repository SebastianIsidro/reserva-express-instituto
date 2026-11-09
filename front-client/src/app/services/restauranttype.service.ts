import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestauranttypeService {

  private baseUrl = environment.apiUrl;

  private restaurantstype: string = `${this.baseUrl}/restauranttypes`

  constructor(
    private http: HttpClient
  ) { }

  listRestaurantTypes(): Observable<any> {
    return this.http.get(this.restaurantstype)
  }
}
