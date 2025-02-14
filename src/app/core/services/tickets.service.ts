import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private http:HttpService) { }

  async getTicketsGroupByStatus() : Promise<any> {
    try {
      const response = await this.http.get('Ticket/GroupByStatus',{});
      return response;
    } catch (error) {
      throw error;
    }
  }
}
