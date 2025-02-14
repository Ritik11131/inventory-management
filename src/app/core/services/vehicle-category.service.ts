import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleCategoryService {

  constructor(private http:HttpService) { }


  async getList() : Promise<any> {
    try {
      const response = await this.http.get('VehicleCategory', {});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async create(category : any) : Promise<any> {
    try {
      const response = await this.http.post('VehicleCategory', {...category});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async update(category : any) : Promise<any> {
    try {
      const response = await this.http.put('VehicleCategory', category.id, {...category});
      return response;
    } catch (error) {
      throw error;
    }
  }
}
