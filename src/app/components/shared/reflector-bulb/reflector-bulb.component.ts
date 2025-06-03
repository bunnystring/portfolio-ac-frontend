import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reflector-bulb',
  imports: [],
  templateUrl: './reflector-bulb.component.html',
  styleUrl: './reflector-bulb.component.scss',
})
export class ReflectorBulbComponent {
  @ViewChild('lamp-light') lamp: ElementRef;
  turnOnLamp: boolean = true;
  constructor() {}

  ngOninit() {}

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
