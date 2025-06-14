import { CommonModule } from '@angular/common';
import { ReflectorBulbServices } from './../../services/reflector-bulb-services/reflector-bulb-services';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-reflector-bulb',
  templateUrl: './reflector-bulb.component.html',
  styleUrl: './reflector-bulb.component.scss',
  imports: [CommonModule],
})
export class ReflectorBulbComponent implements OnInit, AfterViewInit {
  // Variables para el reflector bulb
  @ViewChild('lamp') lampRef: ElementRef;
  showLamp = false;
  lampClass = 'lamp-init';
  turnOnLamp = false;
  flickerStage = 0;
  finalGlow = false;
  swinging = false;
  vibrate = false;

  constructor(private reflectorBulbServices: ReflectorBulbServices) {}

  ngAfterViewInit() {
    this.validateReflectorBulb();
  }

  ngOnInit(): void {}


  /**
   * Método para validar el reflector bulb.
   * Escucha eventos del reflector bulb y ejecuta animaciones correspondientes.
   * @return {void}
   * @throws {Error} Si el reflector bulb no está definido.
   * @description Este método se suscribe a eventos emitidos por el servicio reflectorBulbServices.
   * @version 2.0.0
   * @Author Arlez Camilo Ceron Herrera
   */
  validateReflectorBulb() {
    this.reflectorBulbServices.reflectorBulbEvent.subscribe((event) => {
      if (!event) {
        throw new Error('Reflector bulb is not defined');
      } else if (event.action === 'turnOn') {
        this.animateLampOn();
      } else if (event.action === 'turnOff') {
        this.animateLampOff();
      }
    });
  }

  /**
   * Método para animar el reflector bulb al encenderlo.
   * Cambia la clase del reflector bulb y aplica animaciones.
   * @return {void}
   * @version 2.0.0
   * @Author Arlez Camilo Ceron Herrera
   */
  animateLampOn() {
    this.showLamp = true;
    this.lampClass = 'lamp-init';
    this.vibrate = false;
    this.turnOnLamp = true;
    setTimeout(() => {
      this.lampClass = 'lamp '; // Esto aplica solo dropLamp
      setTimeout(() => {
        this.lampClass = 'lamp swinging '; // Esto aplica solo dropLamp
      }, 1000);
    }, 10);
  }

  /**
   * Método para animar el reflector bulb al apagarlo.
   * Cambia la clase del reflector bulb y aplica animaciones.
   * @return {void}
   * @version 2.0.0
   * @Author Arlez Camilo Ceron Herrera
   */
  animateLampOff() {
    this.lampClass = 'lamp-off';
    this.turnOnLamp = false;
    this.flickerStage = 0;
    this.finalGlow = false;
    this.swinging = false;
    setTimeout(() => {
      this.showLamp = false;
      this.vibrate = true;
      this.lampClass = 'lamp-init';
    }, 1100);
  }

  /**
   * Método que se ejecuta al finalizar la animación de la lámpara.
   * Cambia el estado de vibración y enciende la lámpara si es necesario.
   * @param {any} event - Evento de finalización de animación.
   * @return {void}
   * @version 2.0.0
   * @Author Arlez Camilo Ceron Herrera
   */
  onLampAnimationEnd(event: any) {
    const animationName = event.animationName || event.webkitAnimationName;
    if (animationName === 'dropLamp') {
      this.vibrate = true;
      setTimeout(() => {
        this.vibrate = false;
        this.turnOnLamp = true; // Si quieres que se encienda tras vibrar
      }, 800);
    }
  }
}
