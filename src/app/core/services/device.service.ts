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
      const response = await this.http.get('Device', {});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async createDevice(device : any) : Promise<any> {
    try {
      const response = await this.http.post('Device', {...device});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateDevice(device : any) : Promise<any> {
    try {
      const response = await this.http.put('Device', device.id, {...device});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async deleteDevice(device : any) : Promise<any> { 
    try {
      const response = await this.http.delete('Device', device.id);
      return response;
    } catch (error) {
      throw error;
    }
  }


  deviceTableConfig() {
    return {
      create : true
    }
  }

  async isICCIDValid(iccid: string): Promise<any> {
    try {
      const response = await this.http.get('Device/validate-iccid', { iccid });
      return response;
    } catch (error) {
      throw error;

    }
  }

  async isIMEIValid(imei: string): Promise<any> {
    try {
      const response = await this.http.get('Device/validate-imei', { imei });
      return response;
    } catch (error) {
      throw error;

    }
  }

  async isDeviceSNoValid(devicesno: string): Promise<any> {
    try {
      const response = await this.http.get('Device/validate-devicesno', { devicesno });
      return response;
    } catch (error) {
      throw error;

    }
  }


}