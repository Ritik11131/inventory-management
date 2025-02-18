import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ESimColumns } from '../../../../shared/constants/columns';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-esim',
  standalone: true,
  imports: [CommonModule,FormsModule,ToolbarModule, ButtonModule,TableModule,ProgressSpinnerModule],
  templateUrl: './esim.component.html',
  styleUrl: './esim.component.scss'
})
export class EsimComponent {

  columns:any[] = ESimColumns;
  currentSelectedRow!:any;
  eSimtableData:any[] = [];
  isLoading: boolean = false;


  constructor() {

  }


  onCurrentRowSelectionChange(e:any) {
    console.log(e);
    
  }

}
