import { Component, Input } from '@angular/core';
import { lastPosStatusColors } from '../../../../shared/constants/dashboard';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss'
})
export class VehicleListComponent {

  lastPosStatusColors = lastPosStatusColors;
  @Input() list:any[] = []

}
