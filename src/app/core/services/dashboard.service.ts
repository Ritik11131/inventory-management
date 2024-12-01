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


  async getvehicleTypesAndCount() : Promise<any> {
    try {
      const response = await this.http.get('Dashboard/GetSummaryVehicleType',{});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getInventoryStockActivationCount() : Promise<any> {
    try {
      const response = await this.http.get('Dashboard/StockVsActivation');
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getLastPositionStats() : Promise<any> {
    try {
      const response = await this.http.get('LastPosition');
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getSOSAletCounts() : Promise<any> {
    try {
      const response = await this.http.get('Dashboard/GetAlertCount');
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getRenewalDueCounts() : Promise<any> {
    try {
      const response = await this.http.get('Dashboard/Renewal');
      return response;
    } catch (error) {
      throw error;
    }
  } 


}
