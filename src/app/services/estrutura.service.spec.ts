import { TestBed } from '@angular/core/testing';

import { EstruturaService } from './estrutura.service';

describe('EstruturaService', () => {
  let service: EstruturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstruturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
