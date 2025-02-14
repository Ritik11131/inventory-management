import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceModelService {

  constructor(private http:HttpService) { }


  async getList() : Promise<any> {
    try {
      const response = await this.http.get('DeviceModel', {});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getListByUser(user : any) : Promise<any> {
    try {
      const response = await this.http.get('DeviceModel', {}, user.id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createDeviceModel(deviceModel : any) : Promise<any> {
    try {
      const response = await this.http.post('DeviceModel', {...deviceModel});
      return response;
    } catch (error) {
      throw error;
    }
  }
}
