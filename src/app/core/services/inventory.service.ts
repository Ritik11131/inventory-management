import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http:HttpService) { }



  async getList(pageSize:any,page:any) : Promise<any> {
    try {
      const response = await this.http.get('Inventory/GetAvailable',{ pageSize,page });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
