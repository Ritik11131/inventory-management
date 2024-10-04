import { Component, Input, output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [TableModule, RippleModule, ButtonModule, InputTextModule, InputTextareaModule, CommonModule, 
    FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, 
    InputNumberModule,ToolbarModule,ProgressSpinnerModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent {

  @ViewChild('dt') dt: Table | any;

  @Input() columns: any[] = []; // Dynamic columns
  @Input() data: any[] = []; // Data for the table
  @Input() rows: number = 10; // Rows per page
  @Input() globalFilterFields: string[] = []; // Fields for global filtering
  @Input() selection: any[] = []; // Selected rows
  @Input() header:string = ''
  @Input() isDataLoading: boolean = false;

  selectionChange = output<any>();
  edit = output<any>();
  delete = output<any>();
  new = output<any>();

  onSelectionChange(event: any[]) {
    this.selectionChange.emit(event);
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }

  onNewUser() {
    this.new.emit(true);
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input);
    
    if (input) {
      this.dt.filterGlobal(input.value, 'contains');
    }
  }

  onPrint() {
    this.dt.exportCSV();
  }
}
