import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { CommonModule } from '@angular/common';
import { lucideExternalLink } from '@ng-icons/lucide';

@Component({
  selector: 'app-about-it-component',
  imports: [NgIcon, CommonModule],
  templateUrl: './about-it-component.html',
  styleUrl: './about-it-component.scss',
  viewProviders: [provideIcons({ lucideExternalLink })],
  animations: [
    trigger('fadeInContainer', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
    trigger('popInImage', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('600ms 100ms cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AboutItComponent implements OnInit {
  name: string = 'Arlez Camilo Ceron Herrera';
  yearsExp = 0;
  careerTimeline = [
    { year: 2017, text: 'Empecé a programar como hobby' },
    { year: 2019, text: 'Primer trabajo como Frontend' },
    { year: 2021, text: 'Me convertí en Full Stack' },
    { year: 2024, text: 'Lideré un equipo de desarrollo' }
  ];
  

  ngOnInit(): void {
    let current = 0;
  const target = 5; // tus años reales
  const interval = setInterval(() => {
    current++;
    this.yearsExp = current;
    if (current === target) clearInterval(interval);
  }, 120);
  }


  createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;

    // Elimina todos los ripples previos
    button.querySelectorAll('.ripple').forEach(el => el.remove());

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';

    // Safari: fuerza repaint antes de animar
    ripple.style.transform = 'scale(0)';
    ripple.style.webkitTransform = 'scale(0)';
    void ripple.offsetWidth;

    button.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
    ripple.addEventListener('webkitAnimationEnd', () => ripple.remove());
  }
}
