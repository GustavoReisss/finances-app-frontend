import { TestBed } from '@angular/core/testing';

import { FeatureBagService } from './feature-bag.service';

describe('FeatureBagService', () => {
  let service: FeatureBagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureBagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
