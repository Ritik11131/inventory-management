import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDatepickerComponent } from './generic-datepicker.component';

describe('GenericDatepickerComponent', () => {
  let component: GenericDatepickerComponent;
  let fixture: ComponentFixture<GenericDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDatepickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
