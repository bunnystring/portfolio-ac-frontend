import tippy from 'tippy.js';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { featherAirplay, featherFacebook } from '@ng-icons/feather-icons';
import {lucideFacebook, lucideLinkedin, lucideGithub, lucideInstagram, lucideGamepad2} from '@ng-icons/lucide'
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import {stopMouseEffectSnake } from '../../../../utils/mouse-effects/mouse-effects';
import { EyeTracking } from '../../eye-tracking/eye-tracking';
import { ReflectorBulbServices } from '../../../services/reflector-bulb-services/reflector-bulb-services';

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

  constructor(
    private reflectorBulbServices: ReflectorBulbServices
  ) {}

  ngOnInit(): void {

    //stop mouse effect
    this.insertHtml = stopMouseEffectSnake();
    this.initTippy();
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
      console.log('Reflector bulb turned Off');
      this.reflectorBulbServices.reflectorBulbEvent.emit({
        action: 'turnOff',
        message: 'Reflector bulb turned off',
      });
      this.lampTurnOn = false;
    }
    else {
      console.log('Reflector bulb turned On');
      this.reflectorBulbServices.reflectorBulbEvent.emit({
        action: 'turnOn',
        message: 'Reflector bulb turned on',
      });
      this.lampTurnOn = true;
    }
  }
}
