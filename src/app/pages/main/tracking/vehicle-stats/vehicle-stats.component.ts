import { Component, Input, output } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-vehicle-stats',
  standalone: true,
  imports: [ToolbarModule,InputTextModule],
  templateUrl: './vehicle-stats.component.html',
  styleUrl: './vehicle-stats.component.scss'
})
export class VehicleStatsComponent {

  @Input() total:number = 0; 
  emitSearchedTerm = output<any>()


  onSearch(event:any) {
    this.emitSearchedTerm.emit(event)
    
  }

}
