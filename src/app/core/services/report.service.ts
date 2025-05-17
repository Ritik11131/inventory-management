import { Injectable } from '@angular/core';
import { activationReportColumns, ESimActivationLinkedDeviceColumns } from '../../shared/constants/columns';
import { reportsConfigRoleWise } from '../../shared/constants/report-config';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
      constructor(private authService:AuthService) {}
    private reports = reportsConfigRoleWise[this.authService.getUserRole()];

    

    getReports() {
        return this.reports;
    }

    getReportById(id: string) {
        console.log(this.reports);
        
        return this.reports.find((report: any) => report.id === id);
    }
}
