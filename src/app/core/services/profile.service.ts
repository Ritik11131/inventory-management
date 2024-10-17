import { Injectable, WritableSignal } from '@angular/core';
import { HttpService } from './http.service';
import { Profile } from '../../shared/interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpService) { }


  async resetPassword(object: { oldPassword: string, newPassword: string}): Promise<any> {
    try {
      const response = await this.http.post('Profile/ResetPassword', { ...object })
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getProfileDetails(): Promise<any> {
    try {
      const response = await this.http.get('Profile');
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateProfileDetails(object : Profile): Promise<any> {
    try {
      const response = await this.http.put('Profile', object.sno ,{ ...object });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
