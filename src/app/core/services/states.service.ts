import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  constructor(private http:HttpService) { }



  async getList() : Promise<any> {
    try {
      const response = await this.http.get('State',{});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async createState(state : any) : Promise<any> {
    try {
      const response = await this.http.post('State', {...state});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateState(state : any) : Promise<any> {
    try {
      const response = await this.http.put('State', state.id, {...state});
      return response;
    } catch (error) {
      throw error;
    }
  }
}
