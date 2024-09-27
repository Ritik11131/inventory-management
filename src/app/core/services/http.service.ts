import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private apiUrl = environment.apiUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Send a POST request to the given endpoint with the given data.
   *
   * @param endpoint The endpoint to send the request to.
   * @param data The data to send in the request body.
   * @returns A promise that resolves to the response.
   */
  async post(endpoint: string, data: any): Promise<any> {
    return await firstValueFrom(this.http.post(`${this.apiUrl}/${endpoint}`, data, this.httpOptions));
  }
  

  /**
   * Send a PATCH request to the given endpoint with the given data.
   *
   * @param endpoint The endpoint to send the request to.
   * @param id The ID of the resource to update.
   * @param data The data to send in the request body.
   * @returns A promise that resolves to the response.
   */
  async patch(endpoint: string, id: number, data: any): Promise<any> {
    return await firstValueFrom(this.http.patch(`${this.apiUrl}/${endpoint}/${id}`, data, this.httpOptions));
  }
}
