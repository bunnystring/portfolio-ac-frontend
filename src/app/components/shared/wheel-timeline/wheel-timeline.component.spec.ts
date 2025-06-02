import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelTimelineComponent } from './wheel-timeline.component';

describe('WheelTimelineComponent', () => {
  let component: WheelTimelineComponent;
  let fixture: ComponentFixture<WheelTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
