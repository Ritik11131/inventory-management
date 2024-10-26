import { Component, OnInit } from '@angular/core';
import { GenericStepperComponent } from '../../../../../shared/components/generic-stepper/generic-stepper.component';
import { fitmentFormFields } from '../../../../../shared/constants/forms';
@Component({
  selector: 'app-fitment',
  standalone: true,
  imports: [GenericStepperComponent],
  templateUrl: './fitment.component.html',
  styleUrl: './fitment.component.scss'
})
export class FitmentComponent implements OnInit {

  steps = fitmentFormFields;
  currentStepIndex = 0;
  validationState: { [key: string]: boolean } = {};
  isEditing:boolean = false;
  isValidated:boolean = false;



constructor() {}


ngOnInit(): void {
  this.constructValidationState(fitmentFormFields);
}

  constructValidationState(formObject: any): void {
    console.log(formObject,'formObject');

    formObject.forEach((object : any) => {
      object?.fields.forEach((field : any) => {
        if (field.hasOwnProperty('validation') && field.validation === true) {
          // Check if validationState already has the field; if not, initialize it
          if (this.isEditing) {
            this.validationState[field.name] = true; // Valid for edit case if data exists
          } else {
            this.validationState[field.name] = false; // Invalid or new entry case
          }
        }
      });
    });
    
    
    this.isValidated = Object.values(this.validationState).every(val => val === true);
    console.log(this.isValidated,this.validationState);
    
  }

}
