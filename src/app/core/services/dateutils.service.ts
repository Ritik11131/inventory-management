import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateutilsService {

  constructor() { }


  getOneHourRange(): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date(end.getTime() - (60 * 60 * 1000));
    return { start, end };
  }

  getSixHourRange(): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date(end.getTime() - (6 * 60 * 60 * 1000));
    return { start, end };
  }

  getYesterdayRange(): { start: Date; end: Date } {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    end.setDate(end.getDate() - 1);
    
    const start = new Date(end);
    start.setHours(0, 0, 0, 0);
    
    return { start, end };
  }

  getTodayRange(): { start: Date; end: Date } {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  }
}
