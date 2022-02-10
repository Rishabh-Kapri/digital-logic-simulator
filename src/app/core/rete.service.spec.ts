import { TestBed } from '@angular/core/testing';

import { ReteService } from './rete.service';

describe('ReteService', () => {
  let service: ReteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
