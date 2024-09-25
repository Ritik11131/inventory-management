import { CommonModule } from '@angular/common';
import { Component, Input, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from 'stream';
import { DialogModule } from 'primeng/dialog';



import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';


@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss'
})
export class GenericDialogComponent {


  @Input() visible: boolean = false;
  @Input() header: string='';
  @Input() width: string='';
  @Input() modal: boolean = false;
  @Input() styleClass: string='';

  @Input() fields: any[] = [];
  @Input() data: any;

  onHide = output<any>()
  onSave = output<any>()

  hideDialog() {
    const isVisible = false
    this.onHide.emit(isVisible);
  }

  save() {
    this.onSave.emit(this.data);
  }

}
