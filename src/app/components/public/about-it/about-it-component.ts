import { Component, Input, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { lucideExternalLink } from '@ng-icons/lucide';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-it-component',
  imports: [NgIcon, CommonModule, RouterModule],
  templateUrl: './about-it-component.html',
  styleUrl: './about-it-component.scss',
  viewProviders: [provideIcons({ lucideExternalLink })],
  animations: [
    trigger('fadeInContainer', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '600ms cubic-bezier(.35,0,.25,1)',
          style({ opacity: 1, transform: 'none' })
        ),
      ]),
    ]),
    trigger('popInImage', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate(
          '600ms 100ms cubic-bezier(.35,0,.25,1)',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
    ]),
  ],
})
export class AboutItComponent implements OnInit {
  @Input() name = 'Arlez Camilo Ceron Herrera';
  displayedName: string[] = [];
  showCursor = true;
  isTyping = false;

  yearsExp = 0;
  careerTimeline = [
    { year: 2017, text: 'Started programming as a hobby' },
    { year: 2019, text: 'First job as Frontend' },
    { year: 2021, text: 'I became Full Stack' },
    { year: 2024, text: 'I led a development team' },
  ];

  /**
   * Detecta si el dispositivo es móvil
   * @returns true si el ancho de la ventana es menor a 992px, false en caso contrario
   * Esta propiedad se usa para determinar si se debe mostrar el menú de navegación
   * en modo móvil o de escritorio.
   */
  get isMobile() {
    return window.innerWidth < 992;
  }

  ngOnInit(): void {
    let current = 0;
    const target = 5; // tus años reales
    const interval = setInterval(() => {
      current++;
      this.yearsExp = current;
      if (current === target) clearInterval(interval);
    }, 120);
    this.typeName();
    setInterval(() => (this.showCursor = !this.showCursor), 500);
  }

  /**
   * Método para crear un efecto de "ripple" al hacer clic en el botón.
   * Crea un elemento `span` que simula el efecto de onda expansiva.
   * El tamaño del ripple se ajusta al tamaño del botón y se posiciona
   * en el punto donde se hizo clic.
   * @param {MouseEvent} event - Evento del clic del mouse.
   * @returns {void}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;

    // Elimina todos los ripples previos
    button.querySelectorAll('.ripple').forEach((el) => el.remove());

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = event.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = event.clientY - rect.top - size / 2 + 'px';

    // Safari: fuerza repaint antes de animar
    ripple.style.transform = 'scale(0)';
    ripple.style.webkitTransform = 'scale(0)';
    void ripple.offsetWidth;

    button.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
    ripple.addEventListener('webkitAnimationEnd', () => ripple.remove());
  }

  /**
   * Método para simular la escritura del nombre.
   * Utiliza un bucle para agregar cada letra del nombre al array `displayedName`.
   * Cada letra se agrega con un retraso de 55 ms para simular el efecto de escritura.
   * Al finalizar, se establece `isTyping` a false para indicar que la escritura ha terminado.
   * * @returns {Promise<void>}
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  async typeName() {
    this.isTyping = true;
    this.displayedName = [];
    for (let i = 0; i < this.name.length; i++) {
      this.displayedName.push(this.name[i]);
      await new Promise((r) => setTimeout(r, 55));
    }
    this.isTyping = false;
  }
}
