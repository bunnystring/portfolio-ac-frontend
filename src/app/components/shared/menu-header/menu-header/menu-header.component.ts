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
    // Aquí puedes inicializar cualquier cosa que necesites al cargar el componente

    //stop mouse effect
    this.insertHtml = stopMouseEffectSnake();

    this.initTippy();

    // remove the mouse effect from the header
  }

  onClickMenu() {
    const menu = document.querySelector('.menu');
    if (menu) {
      menu.classList.toggle('active');
    }
  }

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
