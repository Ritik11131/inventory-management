import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPortComponent } from './assign-port.component';

describe('AssignPortComponent', () => {
  let component: AssignPortComponent;
  let fixture: ComponentFixture<AssignPortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPortComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignPortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
