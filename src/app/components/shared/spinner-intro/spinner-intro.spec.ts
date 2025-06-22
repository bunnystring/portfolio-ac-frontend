import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerIntro } from './spinner-intro';

describe('SpinnerIntro', () => {
  let component: SpinnerIntro;
  let fixture: ComponentFixture<SpinnerIntro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerIntro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerIntro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
