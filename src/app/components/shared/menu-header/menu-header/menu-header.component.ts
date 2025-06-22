import tippy from 'tippy.js';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { featherAirplay, featherFacebook } from '@ng-icons/feather-icons';
import { lucideFacebook, lucideLinkedin, lucideGithub, lucideInstagram, lucideGamepad2 } from '@ng-icons/lucide';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { EyeTracking } from '../../eye-tracking/eye-tracking';
import { ReflectorBulbServices } from '../../../services/reflector-bulb-services/reflector-bulb-services';
import { HomeServices } from '../../../services/home-services/home-services';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-header',
  imports: [FlexLayoutModule, EyeTracking, CommonModule],
  standalone: true,
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.scss',
  animations: [
    trigger('headerSlideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-80px)', opacity: 0 }),
        animate(
          '700ms cubic-bezier(.41,1.01,.48,1.26)',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
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
export class MenuHeaderComponent implements OnInit, AfterViewInit {
  // Variables para el menú
  insertHtml: any;
  lampTurnOn: boolean = false;
  modePlaySnake = true;
  showMenu = false;

  constructor(
    private reflectorBulbServices: ReflectorBulbServices,
    private homeServices: HomeServices
  ) {}

  /**
   * Propiedad para determinar si la pantalla es móvil.
   * @returns {boolean} Verdadero si el ancho de la ventana es menor a 992px, falso en caso contrario.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  get isMobile() {
    return window.innerWidth < 992;
  }

  ngAfterViewInit(): void {
    this.initTippy();
  }

  ngOnInit(): void {
    this.activeModeGame(false);
    if (!this.isMobile) {
      this.showMenu = true;
    }
    window.addEventListener('resize', () => {
      if (!this.isMobile) this.showMenu = true;
      else this.showMenu = false;
    });
  }

  /**
   * Método para manejar el evento de clic en el menú.
   * Alterna la clase 'active' en el elemento del menú.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
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
    tippyElements.forEach((element) => {
      const elementId = (element as HTMLElement).id;
      tippy(element, {
        content: elementId,
        placement: 'bottom',
        arrow: true,
        theme: 'light',
      });
    });
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
      this.reflectorBulbServices.reflectorBulbEvent.next({
        action: 'turnOff',
        message: 'Reflector bulb turned off',
      });
      this.lampTurnOn = false;
    }
    else {
      this.reflectorBulbServices.reflectorBulbEvent.next({
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
      this.homeServices.snakeService.next({
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
    this.homeServices.snakeService.next({
      action: 'leaveModeGame',
      message: 'Leave mode game',
      endGame: true,
    });
  }

  /**
   * Método para desplazar la ventana hacia una sección específica.
   * Utiliza el método `scrollIntoView` para un desplazamiento suave.
   * @param sectionId - ID de la sección a la que se desea desplazar.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Si quieres cerrar el menú en móvil:
      if (this.isMobile) this.showMenu = false;
    }
  }
}
