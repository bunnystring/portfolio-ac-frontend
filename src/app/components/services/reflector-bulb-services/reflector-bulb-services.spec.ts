import { TestBed } from '@angular/core/testing';

import { ReflectorBulbServices } from './reflector-bulb-services';

describe('ReflectorBulbServices', () => {
  let service: ReflectorBulbServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReflectorBulbServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
