import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstruturaDadosComponent } from './estrutura-dados.component';

describe('EstruturaDadosComponent', () => {
  let component: EstruturaDadosComponent;
  let fixture: ComponentFixture<EstruturaDadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstruturaDadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstruturaDadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
