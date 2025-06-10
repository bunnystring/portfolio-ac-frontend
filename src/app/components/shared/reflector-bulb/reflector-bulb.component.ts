import { ReflectorBulbServices } from './../../services/reflector-bulb-services/reflector-bulb-services';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reflector-bulb',
  imports: [],
  templateUrl: './reflector-bulb.component.html',
  styleUrl: './reflector-bulb.component.scss',
})
export class ReflectorBulbComponent implements OnInit {
  @ViewChild('lamp-light') lamp: ElementRef;
  turnOnLamp: boolean = true;

  constructor(private reflectorBulbServices: ReflectorBulbServices) {}
  ngOnInit() {
    this.validateReflectorBulb();
  }

  /**
   * Metodo para validar el reflector bulb.
   * Si el reflector bulb no está definido, se lanza un error.
   */
  validateReflectorBulb() {
    this.reflectorBulbServices.reflectorBulbEvent.subscribe((event) => {
      if (!event) {
        throw new Error('Reflector bulb is not defined');
      } else {
        if (event.action === 'turnOn') {
          this.turnOnLamp = true;
          this.onClickLight();
        } else if (event.action === 'turnOff') {
          this.turnOnLamp = false;
          this.onClickLight();
        }
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
    const bulb = document.querySelector('#bulb');
    const lampId = document.querySelector('#lamp') as HTMLElement | null;
    const swinging = lampId?.classList.contains('swinging');
    if (this.turnOnLamp) {
      if (lamp) {
        lampId?.classList.remove('lamp-init');
        lampId?.classList.add('lamp');
        lampId?.classList.remove('lamp-off');
        bulb?.classList.remove('bulb-off');
       if(!swinging){
        setTimeout(() => {
          lampId?.classList.add('swinging');
          lamp.classList.add('light');
          bulb?.classList.remove('bulb-off');
          bulb?.classList.add('bulb-on');
        }, 1300);
       }
      }
      this.turnOnLamp = false;
    } else {
      if (lamp) {
          lampId?.classList.remove('swinging');
          lamp.classList.remove('light');
          bulb?.classList.remove('bulb-on');
          bulb?.classList.add('bulb-off');
          lampId?.classList.remove('lamp-on')
          lampId?.classList.add('lamp-off');
      }
      this.turnOnLamp = true;
    }
  }
}
