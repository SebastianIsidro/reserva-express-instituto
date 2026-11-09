import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserTypesService {

  private baseUrl = environment.apiUrl;

  private usertypes: string = `${this.baseUrl}/usertypes`

  constructor(
    private http: HttpClient
  ) { }

  listUserTypes(): Observable<any> {
    return this.http.get(this.usertypes)
  }
}
