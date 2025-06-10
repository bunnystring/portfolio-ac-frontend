import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RocketScroll } from './rocket-scroll';

describe('RocketScroll', () => {
  let component: RocketScroll;
  let fixture: ComponentFixture<RocketScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RocketScroll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RocketScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
