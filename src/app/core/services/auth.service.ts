import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpService, private tokenService: TokenService) {}



  /**
  * Login function
  * @param credentials Username and Password
  */
  async login(credentials: { Username: string, Password: string }): Promise<any> {
    try {
      const response = await this.http.post('auth/login', credentials);
      this.tokenService.setTokens(response.data.token, response.data.refreshToken, response.data.refreshTokenExpiry);  
      this.tokenService.decodeToken();
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

  getUserRole() : string {
    return this.tokenService.getDecodedToken()?.role
  }

  getUserType(): string {
    return this.tokenService.getDecodedToken()?.role === 'Admin' ? 'OEM' 
      : this.tokenService.getDecodedToken()?.role === 'OEM' ? 'Distributor' 
      : this.tokenService.getDecodedToken()?.role === 'Distributor' ? 'Dealer' 
      : 'User';
  }

  getDeviceEndpointBasedOnRole(): string {
    return this.tokenService.getDecodedToken()?.role === 'Admin' ? 'DeviceModel' : 'Device';
  }

  getUserName() : string {
    return this.tokenService.getDecodedToken()?.unique_name;
  }



  /**
   * Logout function
   */
  async logout(): Promise<any> {
    try {
      const response = await this.http.get('Auth/logout');
      this.tokenService.clearTokens();
      return response;
    } catch (error) {
      throw error;
      
    }
  }




}
