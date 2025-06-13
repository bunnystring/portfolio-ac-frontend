import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillRank {
  rank: string;
  src: string;
  top: number;
  left: number;
}

@Component({
  selector: 'app-rocket-scroll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rocket-scroll.html',
  styleUrl: './rocket-scroll.scss',
})
export class RocketScroll implements OnInit, AfterViewInit {
  @ViewChild('rocket', { static: true }) rocketRef!: ElementRef<HTMLDivElement>;
  @ViewChild('trail', { static: true }) trailRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('rankImg') rankImgs!: QueryList<ElementRef<HTMLImageElement>>;
  @ViewChild('spaceRef', { static: true }) spaceRef!: ElementRef<HTMLDivElement>;
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateRocketPosFromScroll();
    this.checkCollisions();
  }

  public ranks: SkillRank[] = [
    { rank: 'Angular', src: '/assets/images/angularRank.png', top: 0, left: 0 },
    { rank: 'Mysql', src: '/assets/images/mysqlRank.png', top: 0, left: 0 },
    { rank: 'JavaScript', src: '/assets/images/javaScriptRank.png', top: 0, left: 0 },
    { rank: 'SpringBoot', src: '/assets/images/springBootRank.png', top: 0, left: 0 },
    { rank: 'Bootstrap', src: '/assets/images/bootstrapRank.png', top: 0, left: 0 },
    { rank: 'MongoDB', src: '/assets/images/mongoDbRank.png', top: 0, left: 0 },
  ];
  public animatedRanks: boolean[] = [];
  public rocketPos = { top: 50, left: 10 };

  private currentXPercent = 10;
  private lastScroll = 0;
  private readonly minDistance = 35;
  private readonly collisionRadius = 8;
  private dragging = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.placeSkillsWithSeparation();
    this.animatedRanks = this.ranks.map(() => false);
    this.initRocketScroll();
    this.animateTrail();
    this.updateRocketPosFromScroll();
    this.checkCollisions();
    this.setupMobileDrag();
    this.cdr.detectChanges();
  }

  /**
   * Método para colocar las skills con separación mínima entre ellas.
   * @param {number} minDistance - Distancia mínima entre las skills.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método itera sobre las habilidades y coloca cada una en una posición aleatoria,
   */
  private placeSkillsWithSeparation(): void {
    const placed: Array<{ top: number; left: number }> = [];
    for (let i = 0; i < this.ranks.length; i++) {
      let tries = 0;
      let valid = false;
      let candidate = { top: 0, left: 0 };
      while (!valid && tries < 300) {
        candidate.top = this.getRandomInt(18, 82);
        candidate.left = this.getRandomInt(18, 82);
        valid = placed.every((p) => this.distance(candidate, p) >= this.minDistance);
        tries++;
      }
      this.ranks[i].top = candidate.top;
      this.ranks[i].left = candidate.left;
      placed.push({ ...candidate });
    }
  }

  /**
   * Método para calcular la distancia entre dos puntos.
   * @param a
   * @param b
   * @returns
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método utiliza la fórmula de distancia euclidiana para calcular la distancia entre dos puntos
   */
  private distance(a: { top: number; left: number }, b: { top: number; left: number }): number {
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Método para obtener un número entero aleatorio entre un rango.
   * @param min
   * @param max
   * @returns
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método utiliza Math.random() para generar un número aleatorio entre min y max, ambos incluidos.
   */
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Método para inicializar el scroll del cohete.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se encarga de actualizar la posición del cohete en función del scroll de la página,
   */
  private initRocketScroll(): void {
    const rocket = this.rocketRef.nativeElement;
    const space = document.getElementById('space') as HTMLElement;
    const getMaxXPercent = () => {
      const spaceWidth = space?.clientWidth || 1;
      const rocketWidth = rocket?.clientWidth || 1;
      return 90 - (rocketWidth / spaceWidth) * 100;
    };
    const clampXPercent = (x: number) => Math.max(10, Math.min(getMaxXPercent(), x));

    const updateRocket = () => {
      rocket.style.left = `${this.currentXPercent}%`;
      this.rocketPos.left = this.currentXPercent;
      this.checkCollisions();
    };

    this.currentXPercent = 10;
    updateRocket();

    window.addEventListener('scroll', () => {
      const newScroll = window.scrollY;
      const delta = newScroll - this.lastScroll;
      this.currentXPercent += delta * 0.2;
      this.currentXPercent = clampXPercent(this.currentXPercent);
      updateRocket();
      this.lastScroll = newScroll;
    });

    window.addEventListener('resize', () => {
      this.currentXPercent = clampXPercent(this.currentXPercent);
      updateRocket();
    });
  }

  /**
   * Método para animar la estela del cohete.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método se encarga de animar la estela del cohete en función de su velocidad y posición.
   */
  private animateTrail(): void {
    const rocket = this.rocketRef.nativeElement;
    const trail = this.trailRef.nativeElement;
    let lastLeft = this.currentXPercent;

    const animate = () => {
      const rocketLeft = parseFloat(rocket.style.left) || 10;
      const velocity = Math.abs(rocketLeft - lastLeft);
      lastLeft = rocketLeft;

      const trailLength = 15 + velocity * 30;
      const intensity = Math.min(1, velocity / 2 + 0.3);

      trail.style.height = `${trailLength}px`;
      trail.style.opacity = `${0.6 + intensity * 0.3}`;
      trail.style.background = `radial-gradient(circle, orange 30%, transparent 80%)`;

      requestAnimationFrame(animate);
    };
    animate();
  }


  /**
   * Método para actualizar la posición del cohete en función del scroll de la página.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método calcula la posición vertical del cohete en función del scroll de la página,
   * asegurando que se mantenga dentro de un rango específico.
   */
  private updateRocketPosFromScroll(): void {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percentY = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 50;
    this.rocketPos.top = Math.max(10, Math.min(90, percentY));
  }

  /**
   * Método para verificar colisiones entre el cohete y las habilidades.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método itera sobre las habilidades y verifica si hay colisión con el cohete,
   * activando la animación correspondiente si es necesario.
   */
  private checkCollisions(): void {
    this.ranks.forEach((rank, i) => {
      if (this.isColliding(this.rocketPos, rank)) {
        this.triggerSkillAnimation(i);
      }
    });
  }

  /**
   * Método para verificar si el cohete está colisionando con una habilidad.
   * @param rocket - Objeto que representa la posición del cohete.
   * @param skill - Objeto que representa la posición de la habilidad.
   * @returns {boolean} - Retorna true si hay colisión, false en caso contrario.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método calcula la distancia entre el cohete y la habilidad,
   * y verifica si es menor que el radio de colisión definido.
   */
  private isColliding(
    rocket: { top: number; left: number },
    skill: { top: number; left: number }
  ): boolean {
    const dx = rocket.left - skill.left;
    const dy = rocket.top - skill.top;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.collisionRadius;
  }

  /**
   * Método para activar la animación de una habilidad específica.
   * @param index - Índice de la habilidad en el array de habilidades.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método activa la animación de una habilidad al hacer colisión con el cohete,
   * y luego desactiva la animación después de un tiempo.
   */
  public triggerSkillAnimation(index: number): void {
    this.animatedRanks[index] = false;
    setTimeout(() => {
      this.animatedRanks[index] = true;
      setTimeout(() => (this.animatedRanks[index] = false), 900);
    }, 10);
  }

  /**
   * Método para rastrear las habilidades por su fuente.
   * @param index
   * @param item
   * @returns
   */
  trackBySrc(index: number, item: SkillRank) {
    return item.src;
  }

  /**
   * Método para configurar el arrastre del cohete en dispositivos móviles.
   * Permite arrastrar el cohete verticalmente dentro del espacio definido.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @description Este método agrega eventos de touch y mouse para permitir el arrastre del cohete,
   * actualizando su posición en función del movimiento del dedo o del mouse.
   */
  private setupMobileDrag() {
    const rocket = this.rocketRef.nativeElement;
    const space = this.spaceRef.nativeElement;

    let spaceRect = space.getBoundingClientRect();
    let moveHandler = (event: TouchEvent | MouseEvent) => {
      let clientY =
        event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;
      let percentY =
        ((clientY - spaceRect.top) / spaceRect.height) * 100;
      this.rocketPos.top = Math.max(10, Math.min(90, percentY));
      this.checkCollisions();
    };

    // arrastrar con toque
    rocket.addEventListener('touchstart', (e) => {
      this.dragging = true;
      spaceRect = space.getBoundingClientRect();
      e.preventDefault();
    });
    rocket.addEventListener('touchmove', (e) => {
      if (this.dragging) moveHandler(e);
    });
    rocket.addEventListener('touchend', () => {
      this.dragging = false;
    });

    // Drag with mouse (optional for desktop)
    rocket.addEventListener('mousedown', (e) => {
      this.dragging = true;
      spaceRect = space.getBoundingClientRect();
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (this.dragging) moveHandler(e);
    });
    window.addEventListener('mouseup', () => {
      this.dragging = false;
    });
  }
}
