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

    async createRoute(route : any) : Promise<any> {
      try {
        const response = await this.http.post('Geofence', {...route});
        return response;
      } catch (error) {
        throw error;
      }
    }

    async updateRoute(route : any) : Promise<any> {
      try {
        const response = await this.http.put('Geofence', route.id, {...route});
        return response;
      } catch (error) {
        throw error;
      }
    }

    async getRouteById(route : any) : Promise<any> {
      try {
        const response = await this.http.get('Geofence', {}, route.id);
        return response;
      } catch (error) {
        throw error;
      }
    }

    async deleteRoute(route : any) : Promise<any> {
      try {
        const response = await this.http.delete('Geofence', route.id);
        return response;
      } catch (error) {
        throw error;
      }
    }


}
