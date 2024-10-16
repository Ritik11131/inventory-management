import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { DynamicUser } from '../../shared/interfaces/dynamic-user.model';

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


  async createRTO(rto : any) : Promise<any> {
    try {
      const response = await this.http.post('rto', {...rto});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async updateRTO(rto : any) : Promise<any> {
    try {
      const response = await this.http.put('rto', rto.id, {...rto});
      return response;
    } catch (error) {
      throw error;
    }
  }


  async getLinkedRtoUserWise(user : DynamicUser) : Promise<any> {
    try {
      const response = await this.http.get('UserRto/LinkedRtoUserWise', {}, user.sno);  
      return response;
    } catch (error) {
      throw error;
    }
  }
}
