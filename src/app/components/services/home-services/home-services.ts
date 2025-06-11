import { Injectable, Output, EventEmitter  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeServices {

  /**
   * Este servicio se utiliza para manejar el modo juego de la serpiente.
   * Permite emitir eventos relacionados con el juego de la serpiente,
   * como iniciar modo juego o dejar modo serpiente basico.
   * @type {EventEmitter<any>}
   * @memberof HomeServices
   * @example
   * @author Arlez Camilo Ceron Herrera
   */
  @Output() snakeService: EventEmitter<any> = new EventEmitter();

  constructor() { }
}
