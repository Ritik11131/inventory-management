import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ReportService } from '../services/report.service';

@Injectable({
    providedIn: 'root'
})
export class ReportResolver implements Resolve<any> {
    constructor(private reportService: ReportService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const reportId = route.paramMap.get('id');
        return of(this.reportService.getReportById(reportId!));
    }
}
