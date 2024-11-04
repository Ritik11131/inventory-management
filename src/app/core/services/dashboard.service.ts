import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:HttpService) { }


  async getUserCountAndDeviceStock() : Promise<any> {
    try {
      const response = await this.http.get('Dashboard', {});
      return response;
    } catch (error) {
      throw error;
    }
  }
}
