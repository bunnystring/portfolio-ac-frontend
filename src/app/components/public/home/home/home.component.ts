import { ReflectorBulbServices } from './../../../services/reflector-bulb-services/reflector-bulb-services';
import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { ReflectorBulbComponent } from '../../../shared/reflector-bulb/reflector-bulb.component';
import {
  mouseEffectSnake, quitarCanvasSnake
} from '../../../../utils/mouse-effects/mouse-effects';
import { RocketScroll } from '../../../shared/rocket-scroll/rocket-scroll';
import { HomeServices } from '../../../services/home-services/home-services';


@Component({
  selector: 'app-home',
  imports: [NgIcon, FlexLayoutModule, ReflectorBulbComponent, RocketScroll],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  viewProviders: [provideIcons({ lucideExternalLink })],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private reflectorBulbServices: ReflectorBulbServices,
    private homeServices: HomeServices) {
    // Aquí puedes inicializar cualquier cosa que necesites al cargar el componente
  }

  ngOnDestroy() {
    quitarCanvasSnake();
    this.homeServices.snakeService.unsubscribe();
  }
  ngOnInit(): void {

    this.validateModeGameSnake();
  }

  /**
   * Método para validar el modo del juego Snake.
   * Si el modo es 'game-snake', se activa el efecto de mouse.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  validateModeGameSnake() {
    mouseEffectSnake({ gameMode: false });
    this.homeServices.snakeService.subscribe((mode: any) => {
      if (mode.action === 'activeModeGame') {
        quitarCanvasSnake();
        mouseEffectSnake({ gameMode: true });
      }else if (mode.action === 'leaveModeGame') {
        quitarCanvasSnake();
        mouseEffectSnake({ gameMode: false });
      }
    });
  }
}
