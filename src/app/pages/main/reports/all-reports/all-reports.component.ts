import { ButtonModule } from 'primeng/button';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { reportsConfigRoleWise } from '../../../../shared/constants/report-config';
import { AuthService } from '../../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';


@Component({
  selector: 'app-all-reports',
  standalone: true,
  imports: [ButtonModule,CardModule],
  templateUrl: './all-reports.component.html',
  styleUrl: './all-reports.component.scss'
})
export class AllReportsComponent {
    reports!:any;
  
    constructor(private authService:AuthService, private router:Router, private breadCrumbService:BreadcrumbService) {}
  
    ngOnInit(): void {
        this.reports = reportsConfigRoleWise[this.authService.getUserRole()];
    }
  
  
    handleDynamicReport(report:any) {
     this.router.navigate(['/main/reports', report.id]);
    }
  
}
