import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  constructor(private http:HttpService) { }


    async getList() : Promise<any> {
    try {
      const response = await this.http.get('port', {});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async createRTO(port : any) : Promise<any> {
    try {
      const response = await this.http.post('port', {...port});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateRTO(port : any) : Promise<any> {
    try {
      const response = await this.http.put('port', port.id, {...port});
      return response;
    } catch (error) {
      throw error;
    }
  }
}
