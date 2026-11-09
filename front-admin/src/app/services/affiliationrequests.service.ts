import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffiliationRequestsService {

  private baseUrl = environment.apiUrl;

  private affiliationrequests: string = `${this.baseUrl}/affiliationrequests`

  constructor(
    private http: HttpClient
  ) { }

  listAffiliateRequests(): Observable<any> {
    return this.http.get(this.affiliationrequests)
  }
  createAffiliateRequest(request: any): Observable<any> {
    return this.http.post(`${this.affiliationrequests}`, request)
  }

  declineAffiliateRequest(id: number): Observable<any> {
    return this.http.put(`${this.affiliationrequests}/decline/${id}`, {});
  }  

  approveAffiliationRequest(id: number): Observable<any> {
    return this.http.post(`${this.affiliationrequests}/approveAffiliationRequest/${id}`, {});
  }
  

}
