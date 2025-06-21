import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReflectorBulbServices {
  /**
   * Subject para manejar eventos del reflector bulb.
   * Se puede usar para emitir eventos relacionados con el reflector bulb,
   * como encender/apagar la luz u otras interacciones.
   * Cualquier componente que inyecte este servicio puede suscribirse.
   */
  reflectorBulbEvent = new Subject<any>();

  constructor() { }
}
