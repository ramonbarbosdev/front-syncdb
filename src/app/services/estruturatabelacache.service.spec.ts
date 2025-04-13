import { TestBed } from '@angular/core/testing';

import { EstruturaCacheService } from './estruturacache.service';

describe('EstruturatabelacacheService', () => {
  let service: EstruturaCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstruturaCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
