import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FitmentService {

  constructor(private http:HttpService) { }



  async createFitment(fitment : any): Promise<any>{
    try {
      const response = await this.http.post('Fitment', {...fitment});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async isVehicleNoValid(vehicleNo: string): Promise<any> {
    try {
      const response = await this.http.get('Fitment/validate-vehicle', { vehicleNo });
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getVehicleDetails(vehicleNo: string): Promise<any> {
    try {
      const response = await this.http.get('Fitment/vehicle-details', { vehicleNo });
      return response;
    } catch (error) {
      throw error;
    }
  }


  async completeKYC(requestId: string) : Promise<any> {
    try {
      const response = await this.http.get('Fitment/complete-kyc', { requestId });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getPermitHolderDetails(user: any) : Promise<any> {
    try {
      const response = await this.http.get('Fitment/permitholder-details', { }, user?.id);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getFitmentCertificateData(device: any) : Promise<any> {
    try {
      const response = await this.http.get('Fitment/fitment-details', { }, device?.id);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async validateSimValidity(deviceSno:any, vehicleType:any) : Promise<any> {
    try {
      const response = await this.http.get('Fitment/validate-sim-validity', { deviceSno, vehicleType });
      return response;
    } catch (error) {
      throw error;
    }
  }



}
