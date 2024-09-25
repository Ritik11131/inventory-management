import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedDealerComponent } from './assigned-dealer.component';

describe('AssignedDealerComponent', () => {
  let component: AssignedDealerComponent;
  let fixture: ComponentFixture<AssignedDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignedDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
