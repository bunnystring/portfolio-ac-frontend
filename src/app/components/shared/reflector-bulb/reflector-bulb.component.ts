import { ReflectorBulbServices } from './../../services/reflector-bulb-services/reflector-bulb-services';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reflector-bulb',
  imports: [],
  templateUrl: './reflector-bulb.component.html',
  styleUrl: './reflector-bulb.component.scss',
})
export class ReflectorBulbComponent {
  @ViewChild('lamp-light') lamp: ElementRef;
  turnOnLamp: boolean = true;
  @Input() reflectBulb: any;


  constructor(
    private reflectorBulbServices: ReflectorBulbServices
  ) {}

  ngOninit() {
    /* this.validateReflectorBulb();
    this.onClickLight(); */
    console.log('ReflectorBulbComponent finish', this.reflectBulb);
  }

  /**
   * Metodo para validar el reflector bulb.
   * Si el reflector bulb no está definido, se lanza un error.
   */
  validateReflectorBulb() {
    console.log('Validating reflector bulb...');
    this.reflectorBulbServices.reflectorBulbEvent.subscribe((event) => {
      if (!event) {
        throw new Error('Reflector bulb is not defined');
      } else {
        console.log('Reflector bulb is defined', event);
      }
    });
  }


  /**
   * Metodo para manejar el evento de clic en la luz del reflector.
   * Cambia el estado de la luz entre encendida y apagada.
   * Si la luz está encendida, se agrega la clase 'light' al elemento del DOM.
   * Si la luz está apagada, se elimina la clase 'light'.
   * @param event
   */
  onClickLight() {
    const lamp = document.querySelector('.lamp-light');
    if (this.turnOnLamp) {
      if (lamp) {
        lamp.classList.add('light');
      }
      this.turnOnLamp = false;
    } else {
      if (lamp) {
        lamp.classList.remove('light');
      }
      this.turnOnLamp = true;
    }
  }
}
