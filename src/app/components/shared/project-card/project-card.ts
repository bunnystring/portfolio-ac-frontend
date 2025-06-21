import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

export interface Project {
  title: string;
  images: string[];
  description: string;
  demoLink: string;
  repoLink: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class ProjectCard implements OnInit {
  projects: Project[] = [];
  loading = true;
  selectedImageIndex: number[] = [];
  flipped: boolean[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      this.projects = [
        {
          title: 'Portfolio Angular',
          images: [
            'https://picsum.photos/seed/portfolio1/400/250',
            'https://picsum.photos/seed/portfolio2/400/250',
            'https://picsum.photos/seed/portfolio3/400/250'
          ],
          description: 'Un portafolio moderno hecho con Angular 20 y Bootstrap 5. Incluye animaciones, responsive design y una mascota interactiva.',
          demoLink: 'https://tu-demo-angular.com',
          repoLink: 'https://github.com/bunnystring/portfolio-angular',
          createdAt: '2024-09-01',
          updatedAt: '2025-06-01'
        },
        {
          title: 'ToDo App',
          images: [
            'https://picsum.photos/seed/todo1/400/250',
            'https://picsum.photos/seed/todo2/400/250'
          ],
          description: 'Aplicación para organizar tareas, con autenticación, drag & drop y sincronización en la nube (Firebase).',
          demoLink: 'https://tu-todo-app.com',
          repoLink: 'https://github.com/bunnystring/todo-app',
          createdAt: '2024-05-10',
          updatedAt: '2025-05-12'
        },
        {
          title: 'E-commerce Angular',
          images: [
            'https://picsum.photos/seed/ecommerce1/400/250',
            'https://picsum.photos/seed/ecommerce2/400/250',
            'https://picsum.photos/seed/todo2/400/250',
            'https://picsum.photos/seed/todo2/400/250'
          ],
          description: 'Tienda online con Angular, carrito de compras, pasarela de pago y gestión de productos.',
          demoLink: 'https://tu-ecommerce-angular.com',
          repoLink: "",
          createdAt: '',
          updatedAt: ''
        },
      ];
      this.selectedImageIndex = this.projects.map(() => 0);
      this.flipped = this.projects.map(() => false);
      this.loading = false;
    }, 1800);
  }

  prevImage(i: number) {
    if (!this.projects[i] || this.projects[i].images.length < 2) return;
    this.selectedImageIndex[i] =
      (this.selectedImageIndex[i] - 1 + this.projects[i].images.length) % this.projects[i].images.length;
  }

  nextImage(i: number) {
    if (!this.projects[i] || this.projects[i].images.length < 2) return;
    this.selectedImageIndex[i] =
      (this.selectedImageIndex[i] + 1) % this.projects[i].images.length;
  }

  flipCard(i: number) {
    if (typeof this.flipped[i] === 'undefined') return;
    this.flipped[i] = !this.flipped[i];
  }
}
