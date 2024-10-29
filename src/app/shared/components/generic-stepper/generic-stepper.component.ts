import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { StepperModule } from 'primeng/stepper';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-generic-stepper',
  standalone: true,
  imports: [StepperModule,ButtonModule, InputTextareaModule, CommonModule, FileUploadModule,
    DropdownModule, TagModule, RadioButtonModule, RatingModule, MultiSelectModule, FormsModule,
    InputTextModule, FormsModule, InputNumberModule,TooltipModule, IconFieldModule, InputIconModule],
  templateUrl: './generic-stepper.component.html',
  styleUrl: './generic-stepper.component.scss',
  styles: [
    `
    .p-stepper {
        flex-basis: 50rem;
    } 
    `
]
})
export class GenericStepperComponent implements OnChanges {

  @Input() steps: Array<{ header: string; fields: any[] }> = [];
  @Input() currentStepIndex: number = 0;
  @Input() data: { [key: string]: any } = {};
  @Input() validationState: { [key: string]: boolean } = {};
  @Input() isValidated: boolean = true;
  @Input() hideFields: string[] = [];


  onDialogDropdownChange = output<any>();
  onStepperInputTextChange = output<any>();


  ngOnChanges(changes: SimpleChanges): void {
      console.log(this.steps);
      
  }


  // Navigate to the previous step
  prevStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  // Navigate to the next step
  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
  }


  onDropdownChange(event: any, field: any) {
    const selectedValue = event.value;
    const fieldName = field.name;
    this.data[fieldName] = selectedValue;
    this.onDialogDropdownChange.emit({ selectedValue, fieldName });
    console.log(this.data);
  }


  onInputChange(event: any, field: any) {
    const value = event.target.value;
    this.onStepperInputTextChange.emit({ value, field });
  }

}
