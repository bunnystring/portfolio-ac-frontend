import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeTracking } from './eye-tracking';

describe('EyeTracking', () => {
  let component: EyeTracking;
  let fixture: ComponentFixture<EyeTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EyeTracking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EyeTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
