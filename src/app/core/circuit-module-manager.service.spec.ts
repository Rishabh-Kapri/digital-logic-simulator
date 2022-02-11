import { TestBed } from '@angular/core/testing';

import { CircuitModuleManagerService } from './circuit-module-manager.service';

describe('CircuitModuleManagerService', () => {
  let service: CircuitModuleManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CircuitModuleManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
