import { Routes } from "@angular/router";
import { ReportsComponent } from "./reports.component";
import { ReportResolver } from "../../../core/resolvers/report.resolver";
import { ReportDetailComponent } from "./report-detail/report-detail.component";
import { AllReportsComponent } from "./all-reports/all-reports.component";

export const reportsRoutes: Routes = [
    {
        path: '',
        component: ReportsComponent,
        
        children: [
            {
                path:'all',
                component:AllReportsComponent
            }, 
            {
                path: ':id',
                component: ReportDetailComponent,
                resolve: { report: ReportResolver } // Fetch report data before loading
            }
        ]
    }
]