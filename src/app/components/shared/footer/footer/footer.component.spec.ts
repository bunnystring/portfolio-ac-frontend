import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { CommonModule } from '@angular/common';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should show a random mascot speech', () => {
    component.showSpeech = false;
    component.currentSpeech = '';
    component.showMascotSpeech();
    expect(component.showSpeech).toBeTrue();
    expect(component.speeches).toContain(component.currentSpeech);
  });

  it('should hide mascot speech', () => {
    component.showSpeech = true;
    component.hideMascotSpeech();
    expect(component.showSpeech).toBeFalse();
  });

  it('should set isBouncing to true when jumpMascot is called and revert after timeout', (done) => {
    jasmine.clock().install();
    component.isBouncing = false;
    component.jumpMascot();
    expect(component.isBouncing).toBeTrue();
    jasmine.clock().tick(801);
    expect(component.isBouncing).toBeFalse();
    jasmine.clock().uninstall();
    done();
  });

  it('should update isOnline to true when handleOnline is called', () => {
    component.isOnline = false;
    component.handleOnline();
    expect(component.isOnline).toBeTrue();
  });

  it('should update isOnline to false when handleOffline is called', () => {
    component.isOnline = true;
    component.handleOffline();
    expect(component.isOnline).toBeFalse();
  });

  it('should scroll to top when scrollToTop is called', () => {
    spyOn(window, 'scrollTo');
    component.scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should go to next quote and update properties', (done) => {
    const prevIdx = component.currentQuoteIdx;
    const prevQuote = component.currentQuote;
    component.nextQuote();
    setTimeout(() => {
      expect(component.currentQuoteIdx).toBe((prevIdx + 1) % component.quotes.length);
      expect(component.currentQuote).not.toBe(prevQuote);
      expect(component.fadeClass).toBe('fade-in');
      done();
    }, 51);
  });

  it('should randomize speech', () => {
    component.currentSpeech = '';
    component.randomizeSpeech();
    expect(component.speeches).toContain(component.currentSpeech);
  });

  it('should stop waving when stopWaveMascot is called', () => {
    component.isWaving = true;
    component.stopWaveMascot();
    expect(component.isWaving).toBeFalse();
  });

  // Test onWindowScroll behavior (no DOM, just state logic)
  it('should update showScrollTop on scroll', () => {
    spyOnProperty(window, 'scrollY').and.returnValue(301);
    component.showScrollTop = false;
    component.onWindowScroll();
    expect(component.showScrollTop).toBeTrue();
  });

  // Optionally, more tests for typing cycle/timeouts could be added with further setup

});
