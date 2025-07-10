import { TestBed } from '@angular/core/testing';

import { ElectronServiceService } from './electron.service.service';

describe('ElectronServiceService', () => {
  let service: ElectronServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
