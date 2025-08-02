import { TestBed } from '@angular/core/testing';

import { ProjectCardServices } from './project-card-services';

describe('ProjectCardServices', () => {
  let service: ProjectCardServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCardServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
