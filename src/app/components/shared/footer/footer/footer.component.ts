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
  typingClass = true;
  quotes = [
    'Transformando ideas en software, cada línea cuenta.',
    'La perseverancia es el motor del éxito.',
    'El código es poesía en movimiento.',
    'Hazlo simple, pero significativo.',
    'La tecnología es el arte de lo posible.',
  ];
  currentQuoteIdx = 2;
  currentQuote = this.quotes[this.currentQuoteIdx];
  typingSteps = this.currentQuote.length;
  fadeClass: 'fade-in' | 'fade-out' = 'fade-in';

  // Timeouts for animations
  private typingTimeout?: number;
  private quoteTimeout?: number;
  private fadeTimeout?: number;
  isWaving = false;
  showMascotSpeech = false;
  private mascotSpeechTimeout?: any;

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

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el estado de conexión a internet y agrega los eventos para manejar la conexión.
   * También inicia el ciclo de escritura de citas y configura el desplazamiento inicial.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngOnInit() {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    this.onWindowScroll();
  }

  /**
   * Método que se ejecuta después de que la vista del componente ha sido inicializada.
   * Se utiliza para iniciar el ciclo de escritura de citas y configurar el desplazamiento inicial.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngAfterViewInit() {
    setTimeout(() => this.onWindowScroll(), 120);
    this.startTypingCycle();
  }

  /**
   * Método para limpiar los timeouts y eventos al destruir el componente.
   * Se asegura de que no queden procesos pendientes que puedan causar fugas de memoria.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngOnDestroy() {
    clearTimeout(this.typingTimeout);
    clearTimeout(this.quoteTimeout);
    clearTimeout(this.fadeTimeout);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    clearTimeout(this.mascotSpeechTimeout);
  }

  /**
   * Método para manejar el evento de conexión a internet.
   */
  handleOnline = () => {
    this.isOnline = true;
  };

  /**
   * Método para manejar el evento de desconexión a internet.
   * Este método se activa cuando el navegador pierde la conexión a internet.
   * Actualiza la propiedad `isOnline` a `false`.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se activa al detectar el evento `offline` del navegador.
   */
  handleOffline = () => {
    this.isOnline = false;
  };

  /**
   * Método para desplazar la ventana hacia arriba.
   * Utiliza el método `scrollTo` de la ventana para un desplazamiento suave.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se activa al hacer clic en el botón de desplazamiento hacia arriba.
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Método para iniciar el ciclo de escritura de citas.
   * Configura el tiempo de espera para la animación de escritura y el cambio de cita.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  startTypingCycle() {
    this.typingSteps = this.currentQuote.length;
    this.typingClass = true;
    this.typingTimeout = window.setTimeout(() => {
      // Fade out before changing quote
      this.fadeClass = 'fade-out';
      this.typingClass = false;
      this.fadeTimeout = window.setTimeout(() => this.nextQuote(), 450);
    }, 2200 + this.typingSteps * 45);
  }

  /**
   * Método para cambiar a la siguiente cita.
   * Actualiza el índice de la cita actual y reinicia el ciclo de escritura.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  nextQuote() {
    this.currentQuoteIdx = (this.currentQuoteIdx + 1) % this.quotes.length;
    this.currentQuote = this.quotes[this.currentQuoteIdx];
    this.typingSteps = this.currentQuote.length;
    // Fade in and restart typing animation
    this.fadeClass = 'fade-in';
    setTimeout(() => {
      this.typingClass = true;
      this.startTypingCycle();
    }, 50);
  }

  /**
   * Método para iniciar el saludo del personaje.
   * Cambia el estado de `isWaving` a `true` y muestra el discurso del personaje.
   * Después de 1.5 segundos, oculta el discurso del personaje.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  waveMascot() {
    this.isWaving = true;
    this.showMascotSpeech = true;
    clearTimeout(this.mascotSpeechTimeout);
    this.mascotSpeechTimeout = setTimeout(() => {
      this.showMascotSpeech = false;
    }, 1500);
  }


  /**
   * Método para detener el saludo del personaje.
   * Cambia el estado de `isWaving` a `false`.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  stopWaveMascot() {
    this.isWaving = false;
  }


}
