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

  private animating = false;
  private animationFrame: number | null = null;
  private lastDirection: 'up' | 'down' | null = null;
  private lastScrollPercent = 0;
  private animationTarget: number | null = null;
  private animationSpeed = 0.015;

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

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.stopAnimation();
    this.updateRocketAndBaraja();
    this.detectScrollDirectionAndMaybeAnimate();
  }

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
   * Método para iniciar la animación del cohete y las cartas.
   * Cambia el estado de animación y establece el objetivo de animación.
   * @param {string} direction - Dirección de la animación ('up' o 'down').
   * @returns {void}
   * @description Este método se usa para iniciar una animación suave del cohete
   * y las cartas en función de la dirección del scroll del usuario.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
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
      const rel = n === 1 ? 0 : i - mid;
      return rel * spread * accelerated / (mid === 0 ? 1 : mid);
    });
  }

  
  /**
   * Método que calcula el estilo de cada carta en función de su índice.
   * Utiliza la posición del cohete y el porcentaje de scroll para determinar la escala y
   * rotación de las cartas, así como su posición en el eje X.
   * @param {number} i - Índice de la carta.
   * @returns {object} - Objeto con las propiedades de estilo para la carta.
   * @description Este método se usa para aplicar estilos dinámicos a las cartas en función de
   * el scroll del usuario y la posición del cohete. Permite que las cartas se
   * abran y se posicionen de manera atractiva en la pantalla.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  getCardStyle(i: number) {
    const mid = (this.ranks.length - 1) / 2;
    // Detectar mobile
    const isMobile = window.innerWidth <= 700; // o el breakpoint que uses

    // En mobile: forzar openAmount a 1 si percent >= 0.1 (o el umbral que prefieras)
    // En desktop: lógica original
    let openAmount: number;
    if (isMobile) {
      openAmount = this.percent >= 0.1 ? 1 : 0; // se abren apenas pase el cohete
    } else {
      openAmount = this.percent < 0.5
        ? Math.min(1, Math.sqrt(this.percent * 2) * 1.2)
        : 1;
    }

    return {
      left: `calc(50% + ${this.cardsOffset[i]}px)`,
      zIndex: this.ranks.length - Math.abs(i - mid),
      transform: `translate(-50%, -50%) scale(${1 + 0.1 * openAmount}) rotate(${(i - mid) * 8 * openAmount}deg)`,
      transition: 'transform 1s cubic-bezier(.71,1.7,.82,1.01), left 1.2s cubic-bezier(.71,1.7,.82,1.01), box-shadow 0.5s, opacity 0.5s, top 0.4s'
    };
  }

  /**
   * Método para rastrear las cartas por su fuente de imagen.
   * Utilizado por Angular para optimizar el renderizado de listas.
   * @param {number} index - Índice del elemento en la lista.
   * @param {SkillRank} item - Objeto que representa la carta.
   * @returns {string} - Fuente de la imagen de la carta.
   * @description Este método se usa para mejorar el rendimiento al renderizar listas
   * de elementos, permitiendo a Angular identificar cada elemento de manera única.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  trackBySrc(index: number, item: SkillRank) {
    return item.src;
  }

  /**
   * Método para detectar la dirección del scroll y tal vez iniciar una animación.
   * Si el scroll está cerca del centro, inicia la animación hacia arriba.
   * Si el scroll se aleja del centro, inicia la animación hacia abajo.
   * @returns {void}
   * @description Este método se usa para controlar la animación del cohete
   * y las cartas en función de la dirección del scroll del usuario.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private detectScrollDirectionAndMaybeAnimate(): void {
    const centerMin = 0.48;
    const centerMax = 0.52;
    if (
      this.lastScrollPercent >= centerMin &&
      this.lastScrollPercent <= centerMax &&
      !this.animating
    ) {
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
    if (this.lastScrollPercent > this.percent) {
      this.lastDirection = 'down';
    } else if (this.lastScrollPercent < this.percent) {
      this.lastDirection = 'up';
    }
  }

  /**
   * Método para iniciar la animación del cohete y las cartas.
   * Dependiendo de la dirección, ajusta el objetivo de la animación.
   * @param {string} direction - Dirección de la animación ('up' o 'down').
   * @returns {void}
   * @description Este método se usa para iniciar una animación suave
   * que ajusta la posición del cohete y las cartas en función del scroll.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
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

  /**
   * Método para animar el porcentaje de scroll del cohete.
   * Utiliza requestAnimationFrame para una animación suave.
   * Actualiza la posición del cohete y las cartas en cada frame.
   * @returns {void}
   * @description Este método se usa para animar el cohete y las cartas
   * de manera fluida, ajustando su posición y escala según el scroll.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private animatePercent() {
    if (this.animationTarget === null) return;
    this.ngZone.runOutsideAngular(() => {
      const step = () => {
        if (this.animationTarget === null) return;
        const diff = this.animationTarget - this.percent;
        if (Math.abs(diff) < 0.001) {
          this.percent = this.animationTarget;
          this.animating = false;
          this.animationTarget = null;
          this.updateRocketAndBaraja();
          return;
        }
        this.percent += diff * this.animationSpeed;
        this.updateRocketAndBaraja();
        this.animationFrame = requestAnimationFrame(step);
      };
      this.animationFrame = requestAnimationFrame(step);
    });
  }

  /**
   * Método para detener la animación del cohete y las cartas.
   * Limpia el estado de animación y cancela el frame de animación si está activo.
   * @returns {void}
   * @description Este método se usa para detener cualquier animación en curso
   * y restablecer el estado del cohete y las cartas.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
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
