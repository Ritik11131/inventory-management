import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimComponent } from './esim.component';

describe('EsimComponent', () => {
  let component: EsimComponent;
  let fixture: ComponentFixture<EsimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsimComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
