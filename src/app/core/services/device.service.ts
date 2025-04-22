import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http:HttpService,private authService:AuthService) { }

  async getList(pageSize:any,page:any) : Promise<any> {
    try {
      const response = await this.http.get('Device',{ pageSize,page });
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

  async bulkUpload(data: any): Promise<any> {
    try { 
      const response = await this.http.post('Device/upload', data);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async activateDevice(sim:any,device: any): Promise<any> {
    try { 
      const response = await this.http.get('Device/activate-sim', {}, `${sim.id}/${device.id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getVehicleDetails(vehicleNo:string) : Promise<any> {
    try { 
      const response = await this.http.get('Vehicle', {}, vehicleNo);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getVehicleDetailsBySno(sno:string) : Promise<any> {
    try { 
      const response = await this.http.get('Vehicle/GetVehicleBySo', {}, sno);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async sendCommand(data: any) : Promise<any> {
    try { 
      const response = await this.http.post('SendCommand', data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async unlinkDevice(sno:string) : Promise<any> {
    try { 
      const response = await this.http.get('device/UnlinkDevice', {}, sno);
      return response;
    } catch (error) {
      throw error;
    }
  }


}
