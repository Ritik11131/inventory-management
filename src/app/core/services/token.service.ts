import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';
  private refreshTokenExpiryKey = 'refreshTokenExpiry';
  public decodedToken: string | null = null;

  constructor(private http:HttpClient) {
    if(this.getToken()) {
      this.decodeToken();
    }
   }


  getToken(): any {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): any {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getRefreshTokenExpiry(): number | null {
    const expiry = localStorage.getItem(this.refreshTokenExpiryKey);
    return expiry ? Number(expiry) : null;
  }

  setTokens(token: string, refreshToken: string, refreshTokenExpiry: number): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    localStorage.setItem(this.refreshTokenExpiryKey, refreshTokenExpiry.toString());
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.refreshTokenExpiryKey);
  }


  decodeToken(): void {
    try {
      this.decodedToken = jwtDecode(this.getToken());
    } catch (error) {
      this.decodedToken = null;
    }
  }


    refreshToken(): Observable<any> {
      return this.http.post(environment.apiUrl + 'Auth/refresh', { refreshToken : this.getRefreshToken() }, {
        headers: {
          Authorization: this.getRefreshToken()
        },
      });
    }
  
  getDecodedToken(): any {
    return this.decodedToken;
  }
}
