import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressoBarComponent } from './progresso-bar.component';

describe('ProgressoBarComponent', () => {
  let component: ProgressoBarComponent;
  let fixture: ComponentFixture<ProgressoBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressoBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
