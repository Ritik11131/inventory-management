import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class EsimService {

  constructor(private http:HttpService) { }


  async getList(pageSize:any, page:any) : Promise<any> {
    try {
      const response = await this.http.get('SimInventory',{ pageSize,page });
      return response;
    } catch (error) {
      throw error;
    }
  }


  async bulkUpload(data: any): Promise<any> {
    try { 
      const response = await this.http.post('SimInventory/Upload', data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getActivationList(): Promise<any> {
    try {
      const response = await this.http.get('mis/activation/GetRequestList', { });
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getActivationTypes(id:number): Promise<any> {
    try {
      const response = await this.http.get('mis/activation/GetType', {}, id);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getActivationAvailablePlans(id: number): Promise<any> {
    try {
      const response = await this.http.get('mis/activation/GetPlansByType', {}, id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async createActivationRequest(data: any): Promise<any> {
    try {
      const response = await this.http.post('mis/activation/CreateRequest', data);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async addCommentOnActivationRequest(data: any): Promise<any> {
    try {
      const response = await this.http.post('mis/activation/AddCommentOnRequest', data);
      return response;
    } catch (error) {
      throw error;
    }
  }


  async processRequestToOperator(data: any): Promise<any> {
    try {
      const response = await this.http.post('mis/activation/ProcessRequestToOperator', data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getActivationRquestDetailsById(id: number): Promise<any> {
    try {
      const response = await this.http.get('mis/activation/GetRequestById', {}, id);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getRequestStatusByIdFromProvider(id: number): Promise<any> {
    try {
      const response = await this.http.get('mis/activation/GetRequestStatusByIdFromProvider', {}, id);
      return response;
    } catch (error) {
      throw error;
    }
  }





}
