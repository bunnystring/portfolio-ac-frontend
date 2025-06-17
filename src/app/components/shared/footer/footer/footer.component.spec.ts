import {
  Component,
  HostListener,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class FooterComponent implements AfterViewInit, OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  isOnline = true;
  showScrollTop = false;
  revealed = true;

  @ViewChild('footerRef') footerRef?: ElementRef<HTMLElement>;

  quotes = [
    'Transformando ideas en software, cada línea cuenta.',
    'La perseverancia es el motor del éxito.',
    'El código es poesía en movimiento.',
    'Hazlo simple, pero significativo.',
    'La tecnología es el arte de lo posible.',
  ];
  currentQuoteIdx = 0;

  showTyping = true;
  currentQuote = this.quotes[2];
  typingSteps = this.currentQuote.length;

  fadeClass: 'fade-in' | 'fade-out' = 'fade-in';

  private typingTimeout?: number;
  private quoteTimeout?: number;
  private fadeTimeout?: number;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop = window.scrollY > 300;
    if (this.footerRef?.nativeElement) {
      const rect = this.footerRef.nativeElement.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        this.revealed = true;
      }
    }
  }

  constructor() {}

  ngOnInit() {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    this.onWindowScroll();
  }

  ngAfterViewInit() {
    setTimeout(() => this.onWindowScroll(), 120);
    this.startTypingCycle();
  }

  ngOnDestroy() {
    clearTimeout(this.typingTimeout);
    clearTimeout(this.quoteTimeout);
    clearTimeout(this.fadeTimeout);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.isOnline = true;
  };

  handleOffline = () => {
    this.isOnline = false;
  };

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startTypingCycle() {
    this.typingSteps = this.currentQuote.length;
    this.typingTimeout = window.setTimeout(() => {
      // Fade out before changing quote
      this.fadeClass = 'fade-out';
      this.fadeTimeout = window.setTimeout(() => this.nextQuote(), 450); // Match CSS transition
    }, 2200 + this.typingSteps * 45);
  }

  nextQuote() {
    this.showTyping = false;
    setTimeout(() => {
      this.currentQuoteIdx = (this.currentQuoteIdx + 1) % this.quotes.length;
      this.currentQuote = this.quotes[this.currentQuoteIdx];
      this.typingSteps = this.currentQuote.length;
      this.showTyping = true;
      // Fade in new quote
      this.fadeClass = 'fade-in';
      this.startTypingCycle();
    }, 50);
  }
}
