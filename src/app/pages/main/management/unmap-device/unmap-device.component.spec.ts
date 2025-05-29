import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmapDeviceComponent } from './unmap-device.component';

describe('UnmapDeviceComponent', () => {
  let component: UnmapDeviceComponent;
  let fixture: ComponentFixture<UnmapDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnmapDeviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnmapDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
