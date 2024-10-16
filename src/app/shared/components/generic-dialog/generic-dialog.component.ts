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


@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, PickListModule, DragDropModule,
    InputTextModule, InputTextareaModule, CommonModule, FileUploadModule,
    DropdownModule, TagModule, RadioButtonModule, RatingModule, MultiSelectModule,
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
  @Input() source = [
    { name: 'Product 1', category: 'Category A', price: 100, image: 'bamboo-watch.jpg' },
    { name: 'Product 2', category: 'Category B', price: 200, image: 'black-watch.jpg' },
    { name: 'Product 3', category: 'Category A', price: 150, image: 'blue-band.jpg' },
    { name: 'Product 4', category: 'Category C', price: 250, image: 'blue-t-shirt.jpg' },
    { name: 'Product 5', category: 'Category D', price: 300, image: 'bracelet.jpg' }
  ];

  @Input() target = [
    { name: 'Product 6', category: 'Category E', price: 400, image: 'brown-purse.jpg' },
    { name: 'Product 7', category: 'Category F', price: 350, image: 'cherry-watch.jpg' }
  ];

  onHide = output<any>()
  onSave = output<any>()
  onInputTextChange = output<any>();
  onDialogDropdownChange = output<any>();
  focusedField!: any;
  isPasswordToggled: boolean = true;
  isConfirmPasswordToggled: boolean = true;
  selectedStatus!:any;
  selectedDropdownValue!: any;

  constructor() { }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data'] && changes['data'].currentValue) {
      // console.log(this.data, 'dataaa');
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
    const fieldName = field.name;
    this.onInputTextChange.emit({ value, fieldName });
  }

  onDropdownChange(event: any, field: any) {
    const selectedValue = event.value;
    console.log(selectedValue);
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


}
