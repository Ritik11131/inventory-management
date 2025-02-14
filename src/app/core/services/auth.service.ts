import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  // User Role refres to the the parent or logged in user.
  // User Type refres to the the child user.


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
      : this.tokenService.getDecodedToken()?.role === 'Dealer' ? 'User' : 'NA';
  }

  getUserName() : string {
    return this.tokenService.getDecodedToken()?.unique_name;
  }

  getuserId() : string {
    return this.tokenService.getDecodedToken()?.userId;
  }

  async getUserDetails(user:any) : Promise<any> {
    try {
      const response = await this.http.get('User', { }, user?.id);
      return response;
    } catch (error) {
      throw error;
    }
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


  async sendSMSOtp(mobileNo : any, arg?: any) : Promise<any> {
    try {
      const response = await this.http.get('Verification/send-sms-otp', { mobileNo, arg });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(requestId : any) : Promise<any> {
    try {
      const response = await this.http.get('Verification/resend-sms-otp', { requestId });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async validateOtp(requestId : any,otp:any) : Promise<any> {
    try {
      const response = await this.http.get('Verification/validate-sms-otp', { requestId,otp });
      return response;
    } catch (error) {
      throw error;
    }
  }


  async resetPassword({requestId,newPassword} : any) : Promise<any> {
    try {
      const response = await this.http.post('Profile/ForgetPassword', { requestId,newPassword });
      return response;
    } catch (error) {
      throw error;
    }
  }








}
