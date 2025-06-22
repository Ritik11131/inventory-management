import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MoreService {

  constructor(private http:HttpService) { }


  async uploadFirmware(file: File, oemId:any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('oemId', oemId)
      const response = await this.http.post('Firmware/upload', formData);
      return response;
    } catch (error) {
      console.error('Error uploading firmware:', error);
      throw error;
    }
  }

  async getPreviousCertificate(oemId: any): Promise<any> {
    try {
      const response = await this.http.get('Firmware/list', {}, oemId);
      return response;
    } catch (error) {
      console.error('Error fetching previous certificate:', error);
      throw error;
    }
  }
}
