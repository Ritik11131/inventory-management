import { DragDropModule } from 'primeng/dragdrop';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, output, SimpleChanges } from '@angular/core';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { InputOtpModule } from 'primeng/inputotp';
import { GenericStepperComponent } from '../generic-stepper/generic-stepper.component';
import { ExportService } from '../../../core/services/export.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, PickListModule, DragDropModule, ProgressSpinnerModule,
    InputTextModule, InputTextareaModule, CommonModule, FileUploadModule,
    DropdownModule, TagModule, RadioButtonModule, RatingModule, MultiSelectModule, GenericStepperComponent,InputOtpModule,
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
  @Input() sourceHeader:string = 'Source';
  @Input() targetHeader:string = 'Target';
  @Input() sourceHeight: string = '';
  @Input() sourceWidth: string = '';
  @Input() targetHeight: string = '';
  @Input() targetWidth: string = '';
  @Input() breakpoint: string = '';
  @Input() source:any[] = [];
  @Input() target:any[] = [];
  @Input() isStepForm : boolean = false;
  @Input() stepFormFields: any[] = [];
  @Input() customSaveLabel = '';
  @Input() isTable = false;
  @Input() tableColumns:any[] = [];
  @Input() tableData:any[] = []
  @Input() enableSaveBtn:boolean = true;
  @Input() disableStepperNextBtn:boolean = false;

  @Input() isDataLoading: boolean = false;


  onHide = output<any>()
  onSave = output<any>()
  onInputTextChange = output<any>();
  onDialogDropdownChange = output<any>();
  stepperDropDownChange = output<any>();
  stepperInputTextChange = output<any>();
  focusedField!: any;
  isPasswordToggled: boolean = true;
  isConfirmPasswordToggled: boolean = true;
  selectedStatus!:any;
  selectedDropdownValue!: any;
  uploadedFiles: any[] = [];
  stepperCurrentIndex!: number;

  constructor(private exportService:ExportService) { }


  ngOnChanges(changes: SimpleChanges): void {                
    if (changes['data'] && changes['data'].currentValue) {
      console.log(this.data, 'dataaa');
    }
    
    if (changes['isEditing'] && changes['isEditing'].currentValue) {
      if(this.data.hasOwnProperty('active')) {
        this.selectedStatus = this.data['active'] ? 'Active' : 'Inactive';
      } else {
        this.fields.forEach((field: any) => {
          // Check if the field is of type 'dropdown'
          if (field.type === 'dropdown') {
            const selectedId = typeof this.data[field.name] === 'object' ? this.data[field.name].id : this.data[field.name];
            
            // Find the matching object in the dropdown's options based on the id
            const selectedOption = field.options.find((option: any) => option[field.dropdownKeys.idKey] === selectedId);
        
            // If a matching option is found, update the data with the selected option
            if (selectedOption) {
              this.data[field.name] = selectedOption;
            }
          }
        });
      }
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
    this.onInputTextChange.emit({ value, field });
  }

  onDropdownChange(event: any, field: any) {
    const selectedValue = event.value;
    const fieldName = field.name;
    this.data[fieldName] = selectedValue;
    this.onDialogDropdownChange.emit({ selectedValue, fieldName });
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

  onSelect(event: any, field: any) {
    const fieldName = field.name;
    this.data[fieldName] = event.currentFiles[0];
  }

  onStepperDropDownChange(event: any) {
    this.stepperDropDownChange.emit(event);
  }

  onStepperInputTextChange(event: any) {
    this.stepperInputTextChange.emit(event); 
  }

  emitCurrentStepIndex(index: number) {
    this.stepperCurrentIndex = index;
  }

  export() {
    this.exportService.exportToExcel(this.tableData, 'data');
  }


}
