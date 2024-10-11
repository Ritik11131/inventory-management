import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http:HttpService,private authService:AuthService) { }

  async getList() : Promise<any> {
    try {
      const response = await this.http.get(this.authService.getDeviceEndpointBasedOnRole(), {});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async createDevice(device : any) : Promise<any> {
    try {
      const response = await this.http.post('DeviceModel', {...device});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateDevice(device : any) : Promise<any> {
    try {
      const response = await this.http.put('DeviceModel', device.id, {...device});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async deleteDevice(device : any) : Promise<any> { 
    try {
      const response = await this.http.delete('DeviceModel', device.id);
      return response;
    } catch (error) {
      throw error;
    }
  }


}
