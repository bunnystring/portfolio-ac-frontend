import { TestBed } from '@angular/core/testing';

import { HomeServices } from './home-services';

describe('HomeServices', () => {
  let service: HomeServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
