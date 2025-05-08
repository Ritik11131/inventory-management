import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { DynamicUser } from '../../shared/interfaces/dynamic-user.model';

@Injectable({
  providedIn: 'root'
})
export class DynamicUserService {

  constructor(private http:HttpService,private authService:AuthService) { }


  async getList() : Promise<any> {
    try {
      const response = await this.http.get('User',{ userType : this.authService.getUserType() });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getDistributorList() : Promise<any> {
    try {
      const response = await this.http.get('User/GetDistributor');
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getDealerListByDistributor(sno:number) : Promise<any> {
    try {
      const response = await this.http.get('User/GetDealers',{},sno);
      return response;
    } catch (error) {
      throw error;
    }
  }

  


  async createUser(user:DynamicUser) : Promise<any> {
    try {
      const response = await this.http.post('User', { ...user,userType:this.authService.getUserType() });
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateUser(user:DynamicUser) : Promise<any> {
    try {
      const response = await this.http.put('User', user.sno , { ...user });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async isEmailValid(email: string): Promise<any> {
    try {
      const response = await this.http.get('User/validate-email', { email });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async isLoginIdValid(loginId: string): Promise<any> {
    try {
      const response = await this.http.get('User/validate-loginId', { loginId });
      return response;
    } catch (error) {
      throw error;

    }
  }

  async isMobileNoValid(mobile: string): Promise<any> {
    try {
      const response = await this.http.get('User/validate-mobile', { mobile });
      return response;
    } catch (error) {
      throw error;

    }
  }

  async linkRtoToUser(linkObject: any) : Promise<any> {
    try {
      const response = await this.http.post('UserRto/Link', linkObject);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async unlinkRtoToUser(unlinkObject: any) : Promise<any> {
    try {
      const response = await this.http.post('UserRto/UnLink', unlinkObject);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
