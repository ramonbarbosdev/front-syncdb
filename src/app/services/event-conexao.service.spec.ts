import { TestBed } from '@angular/core/testing';

import { EventConexaoService } from './event-conexao.service';

describe('EventConexaoService', () => {
  let service: EventConexaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventConexaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
