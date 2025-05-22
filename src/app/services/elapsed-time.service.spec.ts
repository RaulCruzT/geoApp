import { TestBed } from '@angular/core/testing';

import { ElapsedTimeService } from './elapsed-time.service';

describe('ElapsedTimeService', () => {
  let service: ElapsedTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElapsedTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
