import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http:HttpService) { }
  
  
    async getList() : Promise<any> {
      try {
        const response = await this.http.get('Geofence',{  });
        return response;
      } catch (error) {
        throw error;
      }
    }
}
