import {
  Component,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { RocketScroll } from '../../../shared/rocket-scroll/rocket-scroll';
import { HomeServices } from '../../../services/home-services/home-services';
import {
  mouseEffectSnake,
  quitarCanvasSnake,
} from '../../../../utils/mouse-effects/mouse-effects';
import { CommonModule } from '@angular/common';
import { filter, Subject } from 'rxjs';
import { ProjectCard } from '../../../shared/project-card/project-card';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIcon,
    FlexLayoutModule,
    RocketScroll,
    CommonModule,
    ProjectCard,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({ lucideExternalLink })],
  animations: [
    trigger('fadeInContainer', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '600ms cubic-bezier(.35,0,.25,1)',
          style({ opacity: 1, transform: 'none' })
        ),
      ]),
    ]),
    trigger('popInImage', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate(
          '600ms 100ms cubic-bezier(.35,0,.25,1)',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Variables para el título activo y su índice
  titles: string[] = [
    'FULLSTACK',
    'DEVELOPER',
    'CREATOR',
    'DESIGNER',
    'INNOVATOR',
  ];
  activeTitleIdx = 0;
  activeTitle: string = this.titles[0];
  intervalId: any;
  private destroy$ = new Subject<void>();

  isFlipped = false;
  isImageFlipped = false;
  isMobile = window.innerWidth <= 768;
  isFlipping = false;
  private pressTimeout: any = null;
  private flippingDuration = 600; // debe coincidir con la animación CSS
  private holdToFlipMs = 1000; // 1 segundos
  cardBgShouldAnimate = false;

  constructor(
    private homeServices: HomeServices,
    private title: Title,
    private meta: Meta,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.title.setTitle('Portfolio-AC | Home');
        this.meta.updateTag({
          name: 'description',
          content:
            'Bienvenido a mi portfolio. Descubre mis proyectos, habilidades y experiencia.',
        });
        this.meta.updateTag({
          property: 'og:title',
          content: 'Portfolio-AC | Home',
        });
        this.meta.updateTag({
          property: 'og:description',
          content:
            'Bienvenido a mi portfolio. Descubre mis proyectos, habilidades y experiencia.',
        });
        this.meta.updateTag({
          property: 'og:image',
          content: 'https://portfolio-ac.com/assets/images/home.png',
        });
      });
  }

  ngOnInit(): void {
    this.validateChartsMain();
    this.setMetaData();
    this.countRegress();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Método para activar el modo de juego de la serpiente.
   * Cambia el estado del servicio de la serpiente y activa los efectos del mouse.
   * @param {boolean} mode - Indica si se activa o desactiva el modo de juego.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  validateModeGameSnake() {
    mouseEffectSnake({ gameMode: false });
    this.homeServices.snakeService.subscribe((mode: any) => {
      if (mode.action === 'activeModeGame') {
        quitarCanvasSnake();
        mouseEffectSnake({ gameMode: true, endGame: mode.endGame });
      } else if (mode.action === 'leaveModeGame') {
        quitarCanvasSnake();
        mouseEffectSnake({ gameMode: false, endGame: mode.endGame });
      }
    });
  }

  /**
   * Método para validar los gráficos principales.
   * Activa el intervalo para cambiar el título activo cada 3 segundos.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  validateChartsMain() {
    this.intervalId = setInterval(() => {
      this.activeTitleIdx = (this.activeTitleIdx + 1) % this.titles.length;
      this.activeTitle = this.titles[this.activeTitleIdx];
    }, 2200);
  }

  /**
   * Método para establecer los metadatos de la página.
   * Actualiza el título y las etiquetas meta para SEO y redes sociales.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  setMetaData() {
    this.title.setTitle('Portfolio-AC | Home');
    this.meta.updateTag({
      name: 'description',
      content:
        'Bienvenido a mi portfolio. Descubre mis proyectos, habilidades y experiencia.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Portfolio-AC | Home',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Bienvenido a mi portfolio. Descubre mis proyectos, habilidades y experiencia.',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://portfolio-ac.com/assets/images/home.png',
    });
  }
  /**
   * Método para contar regresivamente.
   * Este método se puede utilizar para implementar una cuenta regresiva o similar. empieza a contar regresivamente segun el valor que se le pase
   * cuando termine el conteo manda un console.log con el mensaje "Cuenta regresiva finalizada"
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  countRegress(){
    let count = 3; // Valor inicial de la cuenta regresiva
    const interval = setInterval(() => {
      if (count > 0) {
        console.log(count);
        count--;
      } else {
        this.onPressStart(); // Llama al método onPressStart cuando la cuenta regresiva termina
        this.animatedCardMain(true);
        clearInterval(interval);
        console.log('Cuenta regresiva finalizada');
      }
    }, 1000); // Intervalo de 1 segundo
  }

  animatedCardMain(cardBgShouldAnimate:boolean) {
    if (!this.isImageFlipped && this.isMobile) {
      setTimeout(() => {
        console.log('Animación de fondo de tarjeta iniciada');
        this.cardBgShouldAnimate = true;
      }, 1500); // 1 segundos
      // despues de los 4 segundos se desactiva la animacion
      setTimeout(() => {
        console.log('Animación de fondo de tarjeta finalizada');
        this.cardBgShouldAnimate = false;
      }, 4000); // 8 segundos
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isImageFlipped = false;
      this.isFlipping = false;
    }
  }

  onFlipImage() {
    if (this.isMobile && this.isImageFlipped) {
      this.isImageFlipped = false;
    }
  }

  onPressStart() {
    if (this.isMobile && !this.isFlipping && !this.isImageFlipped && !this.pressTimeout) {
      this.pressTimeout = setTimeout(() => {
        this.isFlipping = true;
        setTimeout(() => {
          this.isFlipping = false;
          this.isImageFlipped = true;
          this.pressTimeout = null;
        }, this.flippingDuration);
      }, this.holdToFlipMs);
    }
  }

  onPressEnd() {
    if (this.pressTimeout) {
      clearTimeout(this.pressTimeout);
      this.pressTimeout = null;
    }
  }

}
