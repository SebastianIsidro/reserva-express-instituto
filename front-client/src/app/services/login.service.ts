import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = environment.url;

  private login: string = `${this.baseUrl}/login`
  private secretKey = 'mi-clave-secreta';

  constructor(
    private http: HttpClient
  ) { }

  enter(request: any): Observable<any> {
    return this.http.post(`${this.login}`, request, {
      observe: 'response'
    }).pipe(map((response: HttpResponse<any>) => {
      const body = response.body;
      const headers = response.headers;
  
      const usertype_id = headers.get('usertype_id');
      
      if (usertype_id && parseInt(usertype_id) !== 3) {
        Swal.fire({
          icon: 'error',
          title: '¡Acceso denegado!',
          text: 'Este frontend solo está disponible para clientes.',
          showConfirmButton: true
        }).then(() => {
          this.logout();
          window.location.href = '/login'; 
        });
        return new Observable(); 
      }
  
      const bearerToken = headers.get('Authorization');
      const token = bearerToken ? bearerToken.replace('Bearer ', '') : '';
      if (token) {
        localStorage.setItem('token', token);
      }
  
      if (usertype_id) {
        localStorage.setItem('usertype_id', usertype_id);
      }
  
      const id = headers.get('Identifier');
      const userid = id?.replace('User ', '') || '';
      if (userid) {
        const encryptedUserid = this.encryptData(userid);
        localStorage.setItem('userid', encryptedUserid);
      }
  
      return body;
    }));
  }
  
  token() {
    return localStorage.getItem('token');
  }

  getUserid() {
    const userId = localStorage.getItem('userid');

    const encryptedUserid = localStorage.getItem('userid');
    if (encryptedUserid) {
      const decryptedUserid = this.decryptData(encryptedUserid);
      return decryptedUserid ? parseInt(decryptedUserid, 10) : null;
    }
    
    return null;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}
