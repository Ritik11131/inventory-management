import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimProviderComponent } from './sim-provider.component';

describe('SimProviderComponent', () => {
  let component: SimProviderComponent;
  let fixture: ComponentFixture<SimProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimProviderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
