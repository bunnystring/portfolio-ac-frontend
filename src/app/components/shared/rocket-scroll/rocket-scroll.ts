import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rocket-scroll',
  imports: [],
  templateUrl: './rocket-scroll.html',
  styleUrl: './rocket-scroll.scss',
})
export class RocketScroll implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Aquí puedes inicializar cualquier cosa que necesites al cargar el componente
    this.initRocketScroll();
  }

  /**
   * Método para inicializar el efecto de scroll con cohete.
   * @description Este método agrega un evento de scroll para mostrar un cohete que se mueve hacia arriba a medida que se desplaza la página.
   * También agrega un evento de clic para simular el lanzamiento del cohete.
   * @returns void
   * @version 1.0.0
   * @since 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  initRocketScroll() {
    const rocket = document.getElementById('rocket') as HTMLElement;
    const space = document.getElementById('space') as HTMLElement;

    let currentX = 0; // porcentaje relativo al ancho del contenedor
    let lastScroll = window.scrollY;

    const spaceWidth = space.clientWidth;
    const rocketWidth = rocket.clientWidth;
    const rocketWidthPercent = (rocketWidth / spaceWidth) * 100;

    const minX = 0;
    const maxX = 100 - rocketWidthPercent;

    // Función para crear un rastro fugaz detrás del cohete
    function createTrail(xPercent: number) {
      const trail = document.createElement('div');
      trail.className = 'trail';

      // Posición horizontal calculada igual que el cohete, pero un poco atrás (-trail width)
      const trailLeft = (xPercent * spaceWidth) / 100 - 40; // 40px ancho del trail

      // Posición vertical centrada en el contenedor (igual que cohete top 50%)
      trail.style.left = `${trailLeft}px`;
      trail.style.top = `50%`;
      trail.style.transform = 'translate(0, -50%)';

      space.appendChild(trail);

      // Remover el rastro después de la animación
      trail.addEventListener('animationend', () => {
        trail.remove();
      });
    }

    window.addEventListener('scroll', () => {
      const newScroll = window.scrollY;
      const delta = newScroll - lastScroll;

      if (delta > 0) {
        createTrail(currentX);
      }

      currentX += delta * 3; // velocidad desplazamiento horizontal
      currentX = Math.min(maxX, Math.max(minX, currentX));

      rocket.style.left = `${currentX}%`;
      rocket.style.transform = `translate(0, -50%) rotate(${
        (currentX - 50) / 2
      }deg)`;

      lastScroll = newScroll;
    });
  }
}
