import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsimActivationListComponent } from './esim-activation-list.component';

describe('EsimActivationListComponent', () => {
  let component: EsimActivationListComponent;
  let fixture: ComponentFixture<EsimActivationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsimActivationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsimActivationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
