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

  speeches: string[] = [
    '¡Hola humano! 🐶',
    '¿Ya probaste Angular hoy?',
    '¡No olvides sonreír!',
    '¿Necesitas ayuda?',
    '¡Sigue codificando!',
    '¿Café o té? ☕',
    '¡Vamos por más!',
    '✨ ¡Tú puedes! ✨'
  ];
  currentSpeech: string = this.speeches[0];
  showSpeech = false;
  isBouncing = false;



  constructor() {}

  ngOnInit() {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    this.onWindowScroll();
    this.startSpeechLoop();
  }

  showMascotSpeech() {
    this.currentSpeech = this.speeches[Math.floor(Math.random() * this.speeches.length)];
    this.showSpeech = true;
  }
  hideMascotSpeech() {
    this.showSpeech = false;
  }
  jumpMascot() {
    this.isBouncing = true;
    setTimeout(() => this.isBouncing = false, 800);
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
   * Método para detener el saludo del personaje.
   * Cambia el estado de `isWaving` a `false`.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  stopWaveMascot() {
    this.isWaving = false;
  }

  /**
   * Método para iniciar el saludo del personaje.
   * Cambia el estado de `isWaving` a `true` y establece un timeout para detener el saludo después de 2 segundos.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  startSpeechLoop() {
    this.showSpeech = true;
    this.randomizeSpeech();
    setInterval(() => {
      this.showSpeech = false;
      setTimeout(() => {
        this.randomizeSpeech();
        this.showSpeech = true;
      }, 700); // Tiempo sin burbuja antes de la siguiente
    }, 3800); // Tiempo total entre mensajes (incluye animación)
  }

  /**
   * Método para seleccionar un discurso aleatorio de la lista de discursos.
   * Actualiza la propiedad `currentSpeech` con un discurso aleatorio.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  randomizeSpeech() {
    const idx = Math.floor(Math.random() * this.speeches.length);
    this.currentSpeech = this.speeches[idx];
  }
}
