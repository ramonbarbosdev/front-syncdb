import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConexaoComponent } from './conexao.component';

describe('ConexaoComponent', () => {
  let component: ConexaoComponent;
  let fixture: ComponentFixture<ConexaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConexaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConexaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
