import { Component, Input, output } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-vehicle-filters',
  standalone: true,
  imports: [ToolbarModule,ButtonModule],
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
