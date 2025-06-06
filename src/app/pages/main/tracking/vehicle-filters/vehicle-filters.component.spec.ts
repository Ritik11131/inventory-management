import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFiltersComponent } from './vehicle-filters.component';

describe('VehicleFiltersComponent', () => {
  let component: VehicleFiltersComponent;
  let fixture: ComponentFixture<VehicleFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFiltersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
