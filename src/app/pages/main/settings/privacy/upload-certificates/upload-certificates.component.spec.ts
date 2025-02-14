import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCertificatesComponent } from './upload-certificates.component';

describe('UploadCertificatesComponent', () => {
  let component: UploadCertificatesComponent;
  let fixture: ComponentFixture<UploadCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadCertificatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
