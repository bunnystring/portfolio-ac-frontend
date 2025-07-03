import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMe } from './contact-me';

describe('ContactMe', () => {
  let component: ContactMe;
  let fixture: ComponentFixture<ContactMe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactMe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactMe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
