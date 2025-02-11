import { TestBed } from '@angular/core/testing';

import { MemoryStoreService } from './memory-store.service';

describe('MemoryStoreService', () => {
  let service: MemoryStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
