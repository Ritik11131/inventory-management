import { Component, Input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
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
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [TableModule, RippleModule, ButtonModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent {

  @Input() columns: any[] = []; // Dynamic columns
  @Input() data: any[] = []; // Data for the table
  @Input() rows: number = 10; // Rows per page
  @Input() globalFilterFields: string[] = []; // Fields for global filtering
  @Input() selection: any[] = []; // Selected rows
  @Input() header:string = ''

  selectionChange = output<any>();
  edit = output<any>();
  delete = output<any>();

  onSelectionChange(event: any[]) {
    this.selectionChange.emit(event);
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }
}
