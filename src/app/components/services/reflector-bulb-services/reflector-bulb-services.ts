import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReflectorBulbServices {
  /**
   * Event emitter to handle reflector bulb events.
   * This can be used to emit events related to the reflector bulb component,
   * such as toggling the light state or other interactions.
   * The event can be listened to by any component that injects this service.
   * @type {EventEmitter<any>}
   * @memberof ReflectorBulbServices
   * @example
   * @author Arlez Camilo Ceron Herrera
   */
  @Output() reflectorBulbEvent: EventEmitter<any> = new EventEmitter();


  constructor() { }
}
