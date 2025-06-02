import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReflectorBulbComponent } from './reflector-bulb.component';

describe('ReflectorBulbComponent', () => {
  let component: ReflectorBulbComponent;
  let fixture: ComponentFixture<ReflectorBulbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReflectorBulbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReflectorBulbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
