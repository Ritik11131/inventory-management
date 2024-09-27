import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';

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
}
