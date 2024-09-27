import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http:HttpService,private tokenService:TokenService) {}



   /**
   * Login function
   * @param credentials username and password
   */
   async login(credentials: { Username: string, Password: string }): Promise<any> {
    try {
      const response = await this.http.post('login', credentials);
      this.tokenService.setTokens(response.data.token, response.data.refreshToken, response.data.refreshTokenExpiry);
      return response;
    } catch (error) {
      throw error;
    }
  }


   /**
   * Check if user is authenticated
   * @returns True if user is authenticated, false otherwise
   */
   isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }


  /**
   * Logout function
   */
  logout(): void {
    this.tokenService.clearTokens();
  }




}
