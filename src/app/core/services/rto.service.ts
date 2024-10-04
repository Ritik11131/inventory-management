import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class RtoService {

  constructor(private http:HttpService) { }


  async getList(state:any) : Promise<any> {
    try {
      const response = await this.http.get('rto', {}, state.id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
