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
}
