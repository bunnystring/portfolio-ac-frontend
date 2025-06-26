import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface OrbitConfig {
  duration: number;
  radius: number;
  delay: number;
}

interface PlanetState extends OrbitConfig {
  angle: number;
}

@Component({
  selector: 'app-spinner-intro',
  imports: [CommonModule],
  templateUrl: './spinner-intro.html',
  styleUrl: './spinner-intro.scss',
  standalone: true,
})
export class SpinnerIntro {
  @Output() animationEnd = new EventEmitter<void>();

  showSpinner = true;
  showPlanets = true;
  showCollision = false;
  showExplosion = false;
  showAshes = false;
  approaching = false;
  particles: any[] = [];
  planetOrbits: OrbitConfig[] = [];
  planetStates: PlanetState[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura los planetas, oculta el cursor y los canvas, y maneja la animación de introducción.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngOnInit() {
    // Oculta el cursor en todo el body
    this.renderer.addClass(this.document.body, 'spinner-hide-cursor');

    // Oculta todos los canvas mientras dura la animación
    this.toggleCanvasVisibility(false);

    this.planetOrbits = [
      { duration: 2.6, radius: 250, delay: 0 },
      { duration: 3.5, radius: 270, delay: 0.2 },
      { duration: 2.1, radius: 230, delay: 0.4 },
      { duration: 2.9, radius: 320, delay: 0.1 },
      { duration: 3.2, radius: 295, delay: 0.3 },
      { duration: 2.7, radius: 240, delay: 0.15 },
      { duration: 3.0, radius: 310, delay: 0.05 },
    ];

    this.planetStates = this.planetOrbits.map((orbit) => ({
      ...orbit,
      angle: 0
    }));

    setTimeout(() => {
      const orbitTime = 5;
      this.planetStates = this.planetOrbits.map((orbit) => {
        const progress = ((orbitTime + orbit.delay) % orbit.duration) / orbit.duration;
        const angle = progress * 2 * Math.PI;
        return {
          ...orbit,
          angle
        };
      });

      this.approaching = true;

      setTimeout(() => {
        this.showCollision = true;
        setTimeout(() => {
          this.showExplosion = true;
          this.createParticles(18);
          setTimeout(() => {
            this.showPlanets = false;
          }, 300);
          setTimeout(() => {
            this.showExplosion = false;
            this.showAshes = true;
            setTimeout(() => {
              this.hideSpinnerAndCursorAndShowCanvas();
              setTimeout(() => this.animationEnd.emit(), 500);
            }, 1400);
          }, 900);
        }, 350);
      }, 700);
    }, 5000);
  }


  /**
   *  Método para alternar la visibilidad de los canvas en el documento.
   *  Utiliza Renderer2 para cambiar el estilo de display de los elementos canvas.
   *  @param {boolean} show - Si es true, muestra los canvas; si es false, los oculta.
   *  @returns {void}
   *  @version 1.0.0
   *  @author Arlez Camilo Ceron Herrera
   */
  toggleCanvasVisibility(show: boolean) {
    const canvases = this.document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      this.renderer.setStyle(canvas, 'display', show ? '' : 'none');
    });
  }

  /**
   * Método para ocultar el spinner, el cursor y mostrar los canvas.
   * Utiliza Renderer2 para eliminar la clase que oculta el cursor y muestra los canvas.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  hideSpinnerAndCursorAndShowCanvas() {
    this.showSpinner = false;
    // Quita la clase para volver a mostrar el cursor
    this.renderer.removeClass(this.document.body, 'spinner-hide-cursor');
    // Vuelve a mostrar los canvas
    this.toggleCanvasVisibility(true);
  }

  /**
   * Método para crear partículas que simulan cenizas.
   * Genera un número específico de partículas con posiciones y estilos aleatorios.
   * @param {number} n - Número de partículas a crear.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  createParticles(n: number) {
    this.particles = Array(n).fill(0).map((_, i) => {
      const angle = (2 * Math.PI * i) / n;
      const radius = 105 + Math.random() * 35;
      return {
        style: {
          '--tx': `${Math.cos(angle) * radius}px`,
          '--ty': `${Math.sin(angle) * radius}px`,
          'animation-delay': `${Math.random() * 0.2}s`
        }
      };
    });
  }

  /**
   * Método para calcular las posiciones X de los planetas en función del ángulo y el radio.
   * Utilizan funciones trigonométricas para determinar la posición en un círculo.
   * @param {number} angle - Ángulo en radianes.
   * @param {number} radius - Radio del círculo.
   * @returns {number} - Posición X calculada.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  getPlanetX(angle: number, radius: number): number {
    return Math.cos(angle) * radius;
  }

  /**
   * Método para calcular la posición Y de un planeta en función del ángulo y el radio.
   * Utiliza la función seno para determinar la posición vertical en un círculo.
   * @param {number} angle - Ángulo en radianes.
   * @param {number} radius - Radio del círculo.
   * @returns {number} - Posición Y calculada.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  getPlanetY(angle: number, radius: number): number {
    return Math.sin(angle) * radius;
  }
}
