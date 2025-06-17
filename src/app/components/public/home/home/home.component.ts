import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { ReflectorBulbComponent } from '../../../shared/reflector-bulb/reflector-bulb.component';
import { RocketScroll } from '../../../shared/rocket-scroll/rocket-scroll';
import { HomeServices } from '../../../services/home-services/home-services';
import { ReflectorBulbServices } from './../../../services/reflector-bulb-services/reflector-bulb-services';
import {
  mouseEffectSnake,
  quitarCanvasSnake,
} from '../../../../utils/mouse-effects/mouse-effects';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIcon,
    FlexLayoutModule,
    ReflectorBulbComponent,
    RocketScroll,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({ lucideExternalLink })],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Variables para el título activo y su índice
  titles: string[] = [
    'FULLSTACK',
    'DEVELOPER',
    'CREATOR',
    'DESIGNER',
    'INNOVATOR'
  ];
  activeTitleIdx = 0;
  activeTitle: string = this.titles[0];
  intervalId: any;
  private destroy$ = new Subject<void>();

  constructor(
    private homeServices: HomeServices
  ) {}

  ngOnInit(): void {
    this.validateChartsMain();
    this.validateModeGameSnake();
  }

  ngOnDestroy() {
    quitarCanvasSnake();
    this.homeServices.snakeService.unsubscribe();
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
}
