import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  constructor(private http:HttpService) { }



  async getInfoWindowDetails(deviceSno:any) : Promise<any> {
    try {
      const response = await this.http.get('LastPosition/GetVehicleDetails', {}, deviceSno);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getLastPositionRelay(payload:any) : Promise<any> {
    try {
      const response = await this.http.post('LastPosition/Replay', payload);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
