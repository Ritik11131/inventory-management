import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericOverlayComponent } from './generic-overlay.component';

describe('GenericOverlayComponent', () => {
  let component: GenericOverlayComponent;
  let fixture: ComponentFixture<GenericOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
