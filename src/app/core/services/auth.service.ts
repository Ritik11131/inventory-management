import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { TokenService } from './token.service';
import { ToastService } from './toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Cached user details
  private cachedUserType: string | null = null;
  private cachedUserName: string | null = null;
  private cachedUserRole: string | null = null;
  
  // Cache the loadUserDetails promise to prevent multiple API calls
  private loadUserDetailsPromise: Promise<void> | null = null;



  constructor(
    private http: HttpService, 
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastService
  ) {
    // Automatically load user details if authenticated (non-blocking)
    if (this.isAuthenticated()) {
      this.loadUserDetails().catch(() => {
        // Error handling is done in loadUserDetails (logout)
      });
    }
  }



  /**
  * Login function
  * @param credentials Username and Password
  */
  async login(credentials: { Username: string, Password: string }): Promise<any> {
    try {
      const response = await this.http.post('auth/login', credentials);
      this.tokenService.setTokens(response.data.token, response.data.refreshToken, response.data.refreshTokenExpiry);  
      this.tokenService.decodeToken();
      await this.loadUserDetails();
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
    if (this.cachedUserRole !== null) {
      return this.cachedUserRole;
    }
    return '';
  }

  /**
   * Load user details from API
   * This method caches the promise to prevent multiple API calls
   * Multiple components can call this and they'll all wait for the same API call
   */
  async loadUserDetails(): Promise<void> {
    // If a load is already in progress, return the existing promise
    if (this.loadUserDetailsPromise) {
      return this.loadUserDetailsPromise;
    }
    
    // If user details are already loaded, return immediately
    if (this.cachedUserRole !== null) {
      return Promise.resolve();
    }
    
    // Create and cache the promise
    this.loadUserDetailsPromise = this._loadUserDetailsInternal();
    
    // Clear the promise cache after completion (success or failure)
    this.loadUserDetailsPromise.finally(() => {
      this.loadUserDetailsPromise = null;
    });
    
    return this.loadUserDetailsPromise;
  }

  /**
   * Internal method that actually performs the API call
   */
  private async _loadUserDetailsInternal(): Promise<void> {
    try {
      const decodedToken = this.tokenService.getDecodedToken();
      if (!decodedToken || !decodedToken.jti) {
        throw new Error('JTI not found in token');
      }
      
      const response = await this.http.get('auth/tokenDetails', { jti: decodedToken?.jti });
      if (response && response.data) {
        const {role, userName} = response.data;
        this.cachedUserRole = role || null;
        this.cachedUserType = role === 'Admin' ? 'OEM' 
          : role === 'OEM' ? 'Distributor' 
          : role === 'Distributor' ? 'Dealer' 
          : role === 'Dealer' ? 'User' : 'NA';
        this.cachedUserName = userName;
      }
    } catch (error) {
      this.cachedUserName = null;
      this.cachedUserType = null;
      this.cachedUserRole = null;
      if (error instanceof HttpErrorResponse) {
        const errorMessage = error.error?.data || error.message || 'Failed to load user details';
        this.toastService.showError('Error', errorMessage);
        await this.forceLogout();
      } else if (error instanceof Error && error.message === 'JTI not found in token') {
        this.toastService.showError('Error', 'Invalid token. Please login again.');
        await this.forceLogout();
      }
      throw error; // Re-throw to propagate to all waiting promises
    }
  }

  private async forceLogout(): Promise<void> {
    this.tokenService.clearTokens();
    this.cachedUserType = null;
    this.cachedUserName = null;
    this.cachedUserRole = null;
    this.loadUserDetailsPromise = null; // Clear the promise cache
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 100);
  }

  getUserType(): string {
    if (this.cachedUserType !== null) {
      return this.cachedUserType;
    }

    return 'NA';
  }

  getUserName() : string {
    if (this.cachedUserName !== null) {
      return this.cachedUserName;
    }
    return 'NA';
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
      this.cachedUserType = null;
      this.cachedUserName = null;
      this.cachedUserRole = null;
      this.loadUserDetailsPromise = null; // Clear the promise cache
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
