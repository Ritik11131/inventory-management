import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = '';

  constructor(private http:HttpService) {}



   /**
   * Login function
   * @param credentials username and password
   */
   async login(credentials: { username: string, password: string }): Promise<any> {
    try {
      const response = await this.http.post('login', credentials);
      this.token = response.token;
      localStorage.setItem('token', this.token);
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  }


   /**
   * Check if user is authenticated
   * @returns True if user is authenticated, false otherwise
   */
   isAuthenticated(): boolean {
    return !!this.token;
  }


  /**
   * Get token
   */
  getToken(): string {
    return this.token;
  }


  /**
   * Logout function
   */
  logout(): void {
    this.token = '';
    localStorage.clear();
  }




}
