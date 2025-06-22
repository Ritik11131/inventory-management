import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  constructor(private http:HttpService) { }


    async getList(oemId: any) : Promise<any> {
    try {
      const response = await this.http.get('PortAssign/List', {oemId});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async createPort(port : any) : Promise<any> {
    try {
      const response = await this.http.post('PortAssign', {...port});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updatePort(port : any) : Promise<any> {
    try {
      const response = await this.http.put('port', port.id, {...port});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getDomainTypeList() : Promise<any> {
    try {
      const response = await this.http.get('PortAssign/DomainTypes');
      return response;
    } catch (error) {
      throw error;
    }
  }
}
