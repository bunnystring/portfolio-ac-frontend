import {
  Component, ElementRef, OnInit, ViewChild, HostListener, AfterViewInit, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillRank {
  rank: string;
  src: string;
}

@Component({
  selector: 'app-rocket-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rocket-scroll.html',
  styleUrl: './rocket-scroll.scss',
})
export class RocketScroll implements OnInit, AfterViewInit {
  @ViewChild('spaceRef', { static: true }) spaceRef!: ElementRef<HTMLDivElement>;
  public ranks: SkillRank[] = [
    { rank: 'Angular', src: '/assets/images/angularRank.png' },
    { rank: 'Mysql', src: '/assets/images/mysqlRank.png' },
    { rank: 'JavaScript', src: '/assets/images/javaScriptRank.png' },
    { rank: 'SpringBoot', src: '/assets/images/springBootRank.png' },
    { rank: 'Bootstrap', src: '/assets/images/bootstrapRank.png' },
    { rank: 'MongoDB', src: '/assets/images/mongoDbRank.png' },
  ];
  public rocketPos = { left: 0 };
  public cardsOffset: number[] = [];
  public percent = 0;
  private spread = 300;

  // Animación automática tras detener scroll en el centro
  private animating = false;
  private animationFrame: number | null = null;
  private lastDirection: 'up' | 'down' | null = null;
  private lastScrollPercent = 0;
  private animationTarget: number | null = null;
  private animationSpeed = 0.015; // Ajusta para la suavidad/velocidad

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.updateRocketAndBaraja();
  }

  ngAfterViewInit(): void {
    this.calculateSpread();
    this.updateRocketAndBaraja();
    window.addEventListener('resize', () => {
      this.calculateSpread();
      this.updateRocketAndBaraja();
    });
  }
  /**
   * Detecta el scroll en la ventana y actualiza la posición del cohete y las cartas.
   * También inicia la animación si el scroll se detiene cerca del centro.
   * @returns void
   * @version 2.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se ejecuta cada vez que se detecta un evento de scroll en la ventana.
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.stopAnimation();
    this.updateRocketAndBaraja();
    this.detectScrollDirectionAndMaybeAnimate();
  }

  /**
   * Método que calcula el spread (espacio entre las cartas) basado en el ancho de la ventana.
   * Ajusta el spread para que las cartas se distribuyan uniformemente en el viewport.
   * @returns void
   * @version 2.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se ejecuta al inicializar el componente y al redimensionar la ventana.
   */
  private calculateSpread() {
    const minCardMargin = 30;
    const availableWidth = Math.max(
      window.innerWidth - 60,
      this.ranks.length * (minCardMargin + 80)
    );
    const n = this.ranks.length;
    if (n > 1) {
      this.spread = Math.min(
        (availableWidth * 0.5) - 60,
        (availableWidth - n * 120) / 2 + (minCardMargin * ((n-1)/2))
      );
      this.spread = Math.max(this.spread, (n-1)/2 * minCardMargin);
    } else {
      this.spread = 0;
    }
  }

  /**
   * Método que actualiza la posición del cohete y el desplazamiento de las cartas
   * basado en el porcentaje de scroll actual.
   * Calcula la posición del cohete y el desplazamiento de las cartas según el scroll.
   * @returns void
   * @version 2.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se ejecuta al inicializar el componente, al redimensionar la ventana
   */
  private updateRocketAndBaraja(): void {
    const space = this.spaceRef.nativeElement as HTMLElement;
    const rect = space.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    let percent = 0;
    if (rect.bottom > 0 && rect.top < viewportHeight) {
      const totalScroll = viewportHeight + rect.height;
      percent = (viewportHeight - rect.top) / totalScroll;
      percent = Math.max(0, Math.min(1, percent));
    }
    this.lastScrollPercent = percent;
    if (!this.animating) this.percent = percent;

    // Recorrido del cohete
    const minLeft = 0;
    const maxLeft = 100;
    this.rocketPos.left = minLeft + this.percent * (maxLeft - minLeft);

    // Cartas: apertura acelerada
    const accelerated = Math.min(1, Math.sqrt(this.percent) * 1.2);
    const n = this.ranks.length;
    const spread = this.spread;
    this.cardsOffset = this.ranks.map((_, i) => {
      const mid = (n - 1) / 2;
      const rel = i - mid;
      return rel * spread * accelerated / mid;
    });
  }

  /**
   * Método que calcula el estilo de cada carta basado en su índice.
   * Utiliza el índice para determinar la posición, escala y rotación de cada carta.
   * @param i - Índice de la carta para calcular su estilo.
   * @returns
   * {Object} - Estilo CSS para la carta.
   * @version 2.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se utiliza para aplicar estilos dinámicos a las cartas en la baraja.
   */
  getCardStyle(i: number) {
    const mid = (this.ranks.length - 1) / 2;
    // Apertura acelerada
    const openAmount = this.percent < 0.5
      ? Math.min(1, Math.sqrt(this.percent * 2) * 1.2)
      : 1;
    return {
      left: `calc(50% + ${this.cardsOffset[i]}px)`,
      zIndex: this.ranks.length - Math.abs(i - mid),
      transform: `translate(-50%, -50%) scale(${1 + 0.1 * openAmount}) rotate(${(i - mid) * 8 * openAmount}deg)`,
      transition: 'transform 1s cubic-bezier(.71,1.7,.82,1.01), left 1.2s cubic-bezier(.71,1.7,.82,1.01), box-shadow 0.5s, opacity 0.5s, top 0.4s'
    };
  }

  /**
   * Método que devuelve el estilo del cohete basado en el porcentaje de scroll.
   * @param index
   * @param item
   * @returns
   * {Object} - Estilo CSS para el cohete.
   * @version 2.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se utiliza para aplicar estilos dinámicos al cohete en el recorrido.
   */
  trackBySrc(index: number, item: SkillRank) {
    return item.src;
  }

  /**
   * Método que detecta la dirección del scroll y tal vez inicia una animación.
   * @param {MouseEvent} event - El evento del mouse que contiene la posición actual.
   * @returns {void}
   * @version 2.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se ejecuta cada vez que se detecta un evento de scroll en la ventana.
   */
  private detectScrollDirectionAndMaybeAnimate(): void {
    // Centro del recorrido (ajusta el umbral según lo sensible que quieras)
    const centerMin = 0.48;
    const centerMax = 0.52;
    if (
      this.lastScrollPercent >= centerMin &&
      this.lastScrollPercent <= centerMax &&
      !this.animating
    ) {
      // Detecta la última dirección
      if (this.lastDirection !== 'up') {
        this.startAnimation('up');
      }
    } else if (
      (
        this.percent > centerMax && this.lastScrollPercent < centerMax ||
        this.percent < centerMin && this.lastScrollPercent > centerMin
      ) && !this.animating
    ) {
      if (this.lastDirection !== 'down' && this.lastScrollPercent < centerMin) {
        this.startAnimation('down');
      }
    }
    // Actualiza la última dirección
    if (this.lastScrollPercent > this.percent) {
      this.lastDirection = 'down';
    } else if (this.lastScrollPercent < this.percent) {
      this.lastDirection = 'up';
    }
  }

  /**
   * Método que inicia la animación del cohete y las cartas.
   * Dependiendo de la dirección del scroll, ajusta el objetivo de la animación.
   * @param direction - Dirección de la animación ('up' o 'down').
   * @returns {void}
   * @version 2.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se ejecuta al detectar que el scroll se detiene en el centro del recorrido.
   */
  private startAnimation(direction: 'up' | 'down') {
    this.animating = true;
    if (direction === 'up') {
      this.animationTarget = 1;
    } else {
      this.animationTarget = 0;
    }
    this.animatePercent();
  }

  private animatePercent() {
    if (this.animationTarget === null) return;
    this.ngZone.runOutsideAngular(() => {
      const step = () => {
        if (this.animationTarget === null) return;

        // Easing suave
        const diff = this.animationTarget - this.percent;
        if (Math.abs(diff) < 0.001) {
          this.percent = this.animationTarget;
          this.animating = false;
          this.animationTarget = null;
          this.updateRocketAndBaraja();
          return;
        }
        // Animación suave
        this.percent += diff * this.animationSpeed;
        this.updateRocketAndBaraja();
        this.animationFrame = requestAnimationFrame(step);
      };
      this.animationFrame = requestAnimationFrame(step);
    });
  }

  /**
   * Método que detiene la animación del cohete y las cartas.
   * Limpia el estado de animación y cancela el frame de animación si está activo.
   * @returns {void}
   * @version 2.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se ejecuta al detectar un scroll fuera del centro del recorrido.
   */
  private stopAnimation() {
    this.animating = false;
    this.animationTarget = null;
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}
