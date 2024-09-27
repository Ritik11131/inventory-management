import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {


  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';
  private refreshTokenExpiryKey = 'refreshTokenExpiry';

  constructor() { }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
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
}
