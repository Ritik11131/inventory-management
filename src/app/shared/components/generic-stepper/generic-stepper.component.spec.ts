import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericStepperComponent } from './generic-stepper.component';

describe('GenericStepperComponent', () => {
  let component: GenericStepperComponent;
  let fixture: ComponentFixture<GenericStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
