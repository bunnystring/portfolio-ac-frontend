import tippy from 'tippy.js';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { featherAirplay, featherFacebook } from '@ng-icons/feather-icons';
import {lucideFacebook, lucideLinkedin, lucideGithub, lucideInstagram, lucideGamepad2} from '@ng-icons/lucide'
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { EyeTracking } from '../../eye-tracking/eye-tracking';
import { ReflectorBulbServices } from '../../../services/reflector-bulb-services/reflector-bulb-services';
import { HomeServices } from '../../../services/home-services/home-services';

@Component({
  selector: 'app-menu-header',
  imports: [FlexLayoutModule, EyeTracking],
  standalone: true,
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.scss',
  viewProviders: [
    provideIcons({
      featherAirplay,
      lucideFacebook,
      lucideLinkedin,
      lucideGithub,
      lucideInstagram,
      lucideGamepad2,
    }),
  ],
})
export class MenuHeaderComponent implements OnInit {
  insertHtml: any;
  lampTurnOn: boolean = false;
  modePlaySnake = true;

  constructor(
    private reflectorBulbServices: ReflectorBulbServices,
    private homeServices: HomeServices
  ) {}

  ngOnInit(): void {
    this.initTippy();
    this.activeModeGame(false);
  }


  onClickMenu() {
    const menu = document.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('active');
    }
  }

  /**
   * Método para inicializar Tippy.js en los elementos con la clase 'tooltip-header'.
   * Asigna el id del elemento como contenido del tooltip.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  initTippy() {
    const tippyElements = document.querySelectorAll('.tooltip-header');
    let idElement = Array.from(tippyElements).map((el) => el.id);
    if (idElement) {
      tippyElements.forEach((element) => {
        const elementId = (element as HTMLElement).id; // Get the id of the current element
        tippy(element, {
          content: elementId, // Use the id as the content
          placement: 'bottom',
          arrow: true,
          theme: 'light',
        });
      });
    }
  }

  /**
   *  Metodo que se ejecuta cuando se hace click en el icono de la lampara
   *  y emite un evento para encender o apagar la lampara
   *  @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  onClickLight() {
    if (this.lampTurnOn) {
      this.reflectorBulbServices.reflectorBulbEvent.emit({
        action: 'turnOff',
        message: 'Reflector bulb turned off',
      });
      this.lampTurnOn = false;
    }
    else {
      this.reflectorBulbServices.reflectorBulbEvent.emit({
        action: 'turnOn',
        message: 'Reflector bulb turned on',
      });
      this.lampTurnOn = true;
    }
  }
  /**
   * Método para activar el modo juego de la serpiente.
   * Este método emite un evento a través del servicio `snakeService` para activar el modo juego.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  activeModeGame(turnOn?: boolean) {
    if (turnOn) {
      this.homeServices.snakeService.emit({
        action: 'activeModeGame',
        message: 'Active mode game',
        endGame: false
      });
      this.modePlaySnake = false;
    }else{
      this.leaveModeGame();
      this.modePlaySnake = true;
    }
  }

  /**
   * Método para dejar el modo juego de la serpiente.
   * Este método emite un evento a través del servicio `snakeService` para dejar el modo juego.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  leaveModeGame() {
    this.homeServices.snakeService.emit({
      action: 'leaveModeGame',
      message: 'Leave mode game',
      endGame: true,
    });
  }
}
