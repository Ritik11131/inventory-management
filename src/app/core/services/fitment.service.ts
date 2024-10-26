import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FitmentService {

  constructor(private http:HttpService) { }



  async createFitment(fitment : any): Promise<any>{
    try {
      const response = await this.http.post('Fitment', {...fitment});
      return response;
    } catch (error) {
      throw error;
    }
  }
}
