import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCertificadoComponent } from './upload-certificado.component';

describe('UploadCertificadoComponent', () => {
  let component: UploadCertificadoComponent;
  let fixture: ComponentFixture<UploadCertificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadCertificadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
