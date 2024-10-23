import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SimProvidersService {

  constructor(private http:HttpService) { }


  async getList() : Promise<any> {
    try {
      const response = await this.http.get('ServiceProvider', {});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async createSimProvider(simProvider : any) : Promise<any> {
    try {
      const response = await this.http.post('ServiceProvider', {...simProvider});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateSimProvider(simProvider : any) : Promise<any> {
    try {
      const response = await this.http.put('ServiceProvider', simProvider.id, {...simProvider});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async deleteSimProvider(simProvider : any) : Promise<any> { 
    try {
      const response = await this.http.delete('ServiceProvider', simProvider.id);
      return response;
    } catch (error) {
      throw error;
    }
  }


}
