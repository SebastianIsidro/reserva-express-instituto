import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = environment.apiUrl;

  private users: string = `${this.baseUrl}/users`

  constructor(
    private http: HttpClient
  ) { }

  listUsers(): Observable<any> {
    return this.http.get(this.users)
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.users}/${id}`)
  }

  updateUser(id: number, request: any): Observable<any> {
    return this.http.put(`${this.users}/${id}`, request)
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.users}/${id}`)
  }

}