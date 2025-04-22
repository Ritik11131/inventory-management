import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { reportsConfigRoleWise } from '../../shared/constants/report-config';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(private authService:AuthService, private http:HttpService) {}
    private reports = reportsConfigRoleWise[this.authService.getUserRole()];

    getReports() {
        return this.reports;
    }

    getReportById(id: string) {
        return this.reports.find((report: any) => report.id === id);
    }

    async getReportData(api:string ,payloadObj: any): Promise<any> {
        try {
            const response = await this.http.post(api, {...payloadObj});
            return response;
          } catch (error) {
            throw error;
          }
    }   
}
