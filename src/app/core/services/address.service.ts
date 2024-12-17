import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpService) { }

  async fetchAddress(latitude: any, longitude: any): Promise<any> {
    try {
      const response = this.http.get('ReverseGeocode', { latitude, longitude });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
