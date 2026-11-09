import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseUrl = environment.url;

  private register: string = `${this.baseUrl}/register`

  constructor(
    private http: HttpClient
  ) { }

  create(request: any): Observable<any> {
    return this.http.post(`${this.register}`, request)
  }

}
