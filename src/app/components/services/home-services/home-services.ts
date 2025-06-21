import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeServices {
  /**
   * Este servicio se utiliza para manejar el modo juego de la serpiente.
   * Permite emitir eventos relacionados con el juego de la serpiente,
   * como iniciar modo juego o dejar modo serpiente básico.
   * @type {Subject<any>}
   * @memberof HomeServices
   * @example
   * @author Arlez Camilo Ceron Herrera
   */
  snakeService = new Subject<any>();

  constructor() { }
}
