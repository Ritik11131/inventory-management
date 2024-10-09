import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule,
    InputTextModule, InputTextareaModule, CommonModule, FileUploadModule,
    DropdownModule, TagModule, RadioButtonModule, RatingModule,
    InputTextModule, FormsModule, InputNumberModule, ConfirmDialogModule, TooltipModule, IconFieldModule, InputIconModule],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss'
})
export class GenericDialogComponent implements OnChanges {

  @Input() hideFields: string[] = [];
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() width: string = '';
  @Input() modal: boolean = false;
  @Input() styleClass: string = '';
  @Input() isEditing: boolean = false;
  @Input() fields: any[] = [];
  @Input() data: any;
  @Input() validationState: any = {};
  @Input() isValidated: boolean = true;

  onHide = output<any>()
  onSave = output<any>()
  onInputTextChange = output<any>();
  onDialogDropdownChange = output<any>();
  focusedField!: any;
  isPasswordToggled: boolean = false;
  isConfirmPasswordToggled: boolean = false;

  constructor() { }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data'] && changes['data'].currentValue) {
      console.log(this.data, 'dataaa');
    }

    if (changes['isEditing'] && changes['isEditing'].currentValue) {
      console.log(this.isEditing, 'isEditing');
    }
  }

  hideDialog() {
    this.onHide.emit(false);
  }

  save() {
    this.onSave.emit(this.data);
  }


  onStatusChange(event: any, fieldName: string) {
    const selectedValue = event.value;
    if (fieldName === 'active') {
      this.data[fieldName] = selectedValue === 'Active';
    }
  }


  onInputChange(event: any, field: any) {
    const value = event.target.value;
    const fieldName = field.name;
    this.onInputTextChange.emit({ value, fieldName });
  }

  onDropdownChange(event: any, field: any) {
    const value = event.value;
    const fieldName = field.name;
    // this.data[fieldName] = value.id;
    this.onDialogDropdownChange.emit({ value, fieldName });
  }


  disableEvent(event: ClipboardEvent) {
    event.preventDefault();
  }


  togglePassword() {
    this.isPasswordToggled = !this.isPasswordToggled;
  }

  toggleConfirmPassword() {
    this.isConfirmPasswordToggled = !this.isConfirmPasswordToggled;
  }


}
