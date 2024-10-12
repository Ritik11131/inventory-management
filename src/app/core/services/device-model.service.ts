import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceModelService {

  constructor(private http:HttpService) { }


  async getList() : Promise<any> {
    try {
      const response = await this.http.get('Device',{});
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
