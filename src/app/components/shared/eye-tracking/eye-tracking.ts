import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eye-tracking',
  imports: [],
  templateUrl: './eye-tracking.html',
  styleUrl: './eye-tracking.scss'
})
export class EyeTracking  implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Aquí puedes inicializar cualquier cosa que necesites al cargar el componente
    this.initEyeTracking();
  }

  initEyeTracking() {
    // Lógica para inicializar el seguimiento ocular
    console.log('Eye tracking initialized');
    document.addEventListener('mousemove', (event) => {
      const eyes = document.querySelectorAll('.eye');
      eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        const deltaX = event.clientX - eyeCenterX;
        const deltaY = event.clientY - eyeCenterY;
        const distance = Math.min(20, Math.sqrt(deltaX ** 2 + deltaY ** 2));
        const angle = Math.atan2(deltaY, deltaX);
        let pupil = eye.querySelector('.pupil');
        if (pupil) {
        (pupil as HTMLElement).style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      }
      });
    });

    document.addEventListener('click', () => {
      let eyelids = document.querySelectorAll('.eyelid');
      eyelids.forEach(eyelid => {
        (eyelid as HTMLElement).style.top = '0%';
        setTimeout(() => {
          (eyelid as HTMLElement).style.top = '-100%';
        }, 100);
      });
    });
  }

}
