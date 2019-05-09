import { TestBed } from '@angular/core/testing';

import { MainInfoSharingService } from './main-info-sharing.service';

describe('MainInfoSharingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainInfoSharingService = TestBed.get(MainInfoSharingService);
    expect(service).toBeTruthy();
  });
});
