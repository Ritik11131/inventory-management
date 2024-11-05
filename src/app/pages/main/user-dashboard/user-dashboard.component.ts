import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { vehicleStatusOverviewObject } from '../../../shared/constants/dashboard';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent {

  vehicleStatusOverview = vehicleStatusOverviewObject;


}
