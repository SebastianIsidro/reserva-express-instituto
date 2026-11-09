import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  private baseUrl = environment.apiUrl;

  private restaurants: string = `${this.baseUrl}/restaurants`

  constructor(
    private http: HttpClient
  ) { }

  listRestaurants(): Observable<any> {
    return this.http.get(this.restaurants)
  }

  listRestaurantsByName(name: String): Observable<any> {
    return this.http.get(`${this.restaurants}/find/${name}`)
  }

  getRestaurantById(id: number): Observable<any> {
    return this.http.get(`${this.restaurants}/${id}`)
  }

}
