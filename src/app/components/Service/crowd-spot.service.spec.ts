import { TestBed } from '@angular/core/testing';

import { CrowdSpotService } from './crowd-spot.service';

describe('CrowdSpotService', () => {
  let service: CrowdSpotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrowdSpotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
