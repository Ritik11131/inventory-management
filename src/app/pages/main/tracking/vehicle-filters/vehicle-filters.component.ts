import { Component, Input, output } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-vehicle-filters',
  standalone: true,
  imports: [ToolbarModule,ButtonModule,CommonModule,CardModule],
  templateUrl: './vehicle-filters.component.html',
  styleUrl: './vehicle-filters.component.scss'
})
export class VehicleFiltersComponent {

  @Input() vehicleFilterCount:any;
  emitSelectedFilter = output<any>();


  onVehicleFilter(item:any) {
    this.emitSelectedFilter.emit(item);    
  }
 
}
