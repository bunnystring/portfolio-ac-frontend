import { AfterViewInit, Component, OnDestroy } from '@angular/core';
type EyeState = 'normal' | 'feliz' | 'triste' | 'enojado' | 'dormido' | 'sorprendido' | 'amor';

@Component({
  selector: 'app-eye-tracking',
  imports: [],
  templateUrl: './eye-tracking.html',
  styleUrl: './eye-tracking.scss',
})
export class EyeTracking implements AfterViewInit, OnDestroy {


  // Propiedades privadas
  private inactivityTimeout: any = null;

  // Manejadores de eventos para el mouse
  private mouseMoveHandler = this.handleMouseMove.bind(this);
  private clickHandler = this.handleClick.bind(this);
  private dblClickHandler = this.handleDblClickAnywhere.bind(this);
  private winkDuration = 600; // ms

  // Estado visual de las "eyes"
  // Representa el estado actual de las "eyes", que puede ser 'normal', 'feliz', 'triste', 'enojado', 'dormido', 'sorprendido' o 'amor'
  private _estado: EyeState = 'normal';

  // Getter y setter para el estado visual
  // Permite acceder y modificar el estado visual de las "eyes"
  get estado(): EyeState {
    return this._estado;
  }
  // Setter que aplica el estado visual y actualiza las "eyes"
  // Permite cambiar el estado visual de las "eyes"
  set estado(nuevo: EyeState) {
    this._estado = nuevo;
    this.aplicarEstadoVisual(nuevo);
  }

  /**
   * Método que se ejecuta después de que la vista del componente ha sido inicializada.
   * Aquí se configuran los eventos del mouse y se inicializa el estado visual.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngAfterViewInit() {
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('click', this.clickHandler);
    document.addEventListener('dblclick', this.dblClickHandler);
    this.estado = 'feliz'; // Inicializar el estado visual

    this.setInactivityTimer();
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Aquí se eliminan los eventos del mouse y se limpia el temporizador de inactividad.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngOnDestroy() {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('click', this.clickHandler);
    document.removeEventListener('dblclick', this.dblClickHandler);

    if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout);
  }

  /**
   * Método que maneja el movimiento del mouse.
   * Actualiza la posición de las pupilas según la posición del mouse y el estado visual actual.
   * Si el estado es 'dormido', cambia a 'normal'.
   * @param {MouseEvent} event - El evento del mouse que contiene la posición actual.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  handleMouseMove(event: MouseEvent) {
    if (this.estado === 'dormido') this.estado = 'normal';

    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
      const rect = eye.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;
      const deltaX = event.clientX - eyeCenterX;
      const deltaY = event.clientY - eyeCenterY;
      const distance = Math.min(10, Math.sqrt(deltaX ** 2 + deltaY ** 2));
      const angle = Math.atan2(deltaY, deltaX);
      const pupil = eye.querySelector('.pupil') as HTMLElement;
      if (pupil) {
        switch (this.estado) {
          case 'dormido':
            pupil.style.transform = `translate(0px, 8px) scale(0.5,0.2)`;
            break;
          case 'triste':
            pupil.style.transform = `translate(${Math.cos(angle) * (distance / 2)}px, ${Math.sin(angle) * (distance / 2) + 4}px) scale(0.95,1.3)`;
            break;
          case 'feliz':
            pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.1,0.9)`;
            break;
          case 'enojado':
            pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(-10deg) scale(1,0.8)`;
            break;
          case 'sorprendido':
            pupil.style.transform = `translate(0,0) scale(1.3,1.3)`;
            break;
          case 'amor':
            pupil.style.transform = `translate(${Math.cos(angle) * (distance/1.5)}px, ${Math.sin(angle) * (distance/1.5)}px) scale(1,1)`;
            break;
          default:
            pupil.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1,1)`;
        }
      }
    });

    this.setInactivityTimer();
  }

  /**
   * Método que maneja el clic del mouse.
   * Hace que las pestañas se abran y cierren al hacer clic.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  handleClick() {
    const eyelids = document.querySelectorAll('.eyelid');
    eyelids.forEach(eyelid => {
      (eyelid as HTMLElement).style.top = '0%';
      setTimeout(() => {
        (eyelid as HTMLElement).style.top = '-100%';
      }, 100);
    });
  }


  /**
   * Método que maneja el doble clic del mouse.
   * Hace que las pestañas parpadeen en el ojo derecho.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  handleDblClickAnywhere() {
    if (
      this.estado !== 'amor' &&
      this.estado !== 'normal' &&
      this.estado !== 'sorprendido'
    ) {
      return;
    }

    const rightGroup = document.querySelectorAll('.eye-group')[1];
    if (!rightGroup) return;

    const eyelid = rightGroup.querySelector('.eyelid') as HTMLElement;
    const pupil = rightGroup.querySelector('.pupil') as HTMLElement;

    if (eyelid) {
      eyelid.classList.add('eyelid-wink');
      eyelid.style.top = '0%';
    }
    if (pupil) {
      pupil.classList.add('pupil-wink');
    }

    setTimeout(() => {
      if (eyelid) {
        eyelid.classList.remove('eyelid-wink');
        eyelid.style.top = '-100%';
      }
      if (pupil) {
        pupil.classList.remove('pupil-wink');
      }
    }, this.winkDuration);
  }

  /**
   * Método que establece un temporizador de inactividad.
   * Si no hay actividad del mouse durante 5 segundos, cambia el estado a 'dormido'.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  setInactivityTimer() {
    if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.estado = 'dormido';
    }, 5000);
  }


  /**
   * Método que aplica el estado visual a las "eyes".
   * Cambia las clases de las "eyes", pupilas, párpados, lágrimas y corazones según el estado.
   * @param {EyeState} estado - El estado visual a aplicar.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  aplicarEstadoVisual(estado: EyeState) {
    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
      const pupil = eye.querySelector('.pupil') as HTMLElement;
      const eyelid = eye.querySelector('.eyelid') as HTMLElement;
      const tear = eye.querySelector('.tear') as HTMLElement;
      const heart = eye.querySelector('.heart') as HTMLElement;

      eye.classList.remove(
        'eye-happy', 'eye-sad', 'eye-angry', 'eye-sleep', 'eye-normal', 'eye-surprised', 'eye-love'
      );
      if (pupil) {
        pupil.classList.remove(
          'pupil-happy', 'pupil-sad', 'pupil-angry', 'pupil-sleep', 'pupil-normal', 'pupil-surprised', 'pupil-love'
        );
      }
      if (tear) tear.style.opacity = '0';
      if (heart) heart.style.opacity = '0';
      switch (estado) {
        case 'feliz':
          eye.classList.add('eye-happy');
          if (pupil) pupil.classList.add('pupil-happy');
          break;
        case 'triste':
          eye.classList.add('eye-sad');
          if (pupil) pupil.classList.add('pupil-sad');
          if (tear) tear.style.opacity = '1';
          break;
        case 'enojado':
          eye.classList.add('eye-angry');
          if (pupil) pupil.classList.add('pupil-angry');
          break;
        case 'dormido':
          eye.classList.add('eye-sleep');
          if (pupil) pupil.classList.add('pupil-sleep');
          if (eyelid) eyelid.style.top = '0%';
          break;
        case 'sorprendido':
          eye.classList.add('eye-surprised');
          if (pupil) pupil.classList.add('pupil-surprised');
          break;
        case 'amor':
          eye.classList.add('eye-love');
          if (pupil) pupil.classList.add('pupil-love');
          if (heart) heart.style.opacity = '1';
          break;
        default:
          eye.classList.add('eye-normal');
          if (pupil) pupil.classList.add('pupil-normal');
          if (eyelid) eyelid.style.top = '-100%';
      }
      if (estado !== 'dormido' && eyelid) eyelid.style.top = '-100%';
      if (estado === 'dormido' && eyelid) eyelid.style.top = '0%';
    });
  }
}
