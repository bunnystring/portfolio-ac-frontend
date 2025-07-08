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

  // Paginador
  page = 1;
  itemsPerPage = 2;

  get totalPages(): number {
    return Math.ceil(this.projects.length / this.itemsPerPage);
  }

  get paginatedProjects(): Project[] {
    const start = (this.page - 1) * this.itemsPerPage;
    return this.projects.slice(start, start + this.itemsPerPage);
  }

  getGlobalIndex(idx: number): number {
    return idx + (this.page - 1) * this.itemsPerPage;
  }

  /**
   * Función para detectar si el dispositivo es móvil.
   * Utiliza el ancho de la ventana para determinar si es menor a 700px.
   * @returns true si el ancho de la ventana es menor a 700px, false en caso contrario.
   * Esta propiedad se usa para ajustar el diseño y la funcionalidad del componente
   * según el tipo de dispositivo.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  get isMobile() {
    return window.innerWidth < 700;
  }

  /**
   * Inicializa el componente y carga los proyectos después de un breve retraso.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngOnInit(): void {
    // Simula una carga de datos con un retraso Ojo: Eliminar esta data despues de la demo
    setTimeout(() => {
      this.projects = [
        {
          title: 'Portfolio AC Angular',
          images: [
            '/assets/images/home.png',
            '/assets/images/contactPage.png',
            '/assets/images/aboutit.png',
          ],
          description:
            'A modern portfolio built with Angular 20 and Bootstrap 5. Featuring animations, responsive design, and an interactive pet.',
          demoLink: 'https://portfolio-ac.com',
          repoLink: 'https://github.com/bunnystring/portfolio-ac',
          createdAt: '2025-05-01',
          updatedAt: '2025-07-08',
        },
        {
          title: 'ToDo App',
          images: [
            '',
            '',
          ],
          description:
            'Task management app with authentication, drag & drop, and cloud sync (Firebase).',
          demoLink: '',
          repoLink: 'https://github.com/bunnystring',
          createdAt: '2024-05-01',
          updatedAt: '2025-05-08',
        },
        {
          title: 'E-commerce Angular',
          images: [
            '',
            '',
            '',
            '',
          ],
          description:
            'Store online with Angular, shopping cart, payment gateway and product management.',
          demoLink: '',
          repoLink: '',
          createdAt: '',
          updatedAt: '',
        },
        {
          title: 'Blog Angular',
          images: [
            '',
            '',
          ],
          description:
            'Personal blog with Angular, authentication, comments, and post management.',
          demoLink: '',
          repoLink: '',
          createdAt: '',
          updatedAt: '',
        },
        {
          title: 'Chat App',
          images: [
            '',
            '',
          ],
          description:
            'Aplicación de chat en tiempo real con Angular, WebSockets y autenticación.',
          demoLink: 'https://tu-chat-app.com',
          repoLink: '',
          createdAt: '',
          updatedAt: '',
        },
        {
          title: 'Weather App',
          images: [
            '',
            '',
          ],
          description:
            'Weather app with Angular, weather API and geolocation.',
          demoLink: 'https://github.com/bunnystring',
          repoLink: '',
          createdAt: '',
          updatedAt: '',
        },
      ];
      this.selectedImageIndex = this.projects.map(() => 0);
      this.flipped = this.projects.map(() => false);
      this.loading = false;
    }, 1800);

    if (this.isMobile) {
      this.itemsPerPage = 1; // Ajusta el número de proyectos por página en dispositivos móviles
    }
  }

  /**
   * Cambia la imagen seleccionada hacia atrás en el carrusel de imágenes del proyecto.
   * Si el proyecto no tiene imágenes o solo tiene una, no hace nada.
   * @param i  Índice del proyecto
   * @returns
   *  @version 1.0.0
   *  @author Arlez Camilo Ceron Herrera
   */
  prevImage(i: number) {
    if (!this.projects[i] || this.projects[i].images.length < 2) return;
    this.selectedImageIndex[i] =
      (this.selectedImageIndex[i] - 1 + this.projects[i].images.length) %
      this.projects[i].images.length;
  }

  /**
   * Cambia la imagen seleccionada hacia adelante en el carrusel de imágenes del proyecto.
   * Si el proyecto no tiene imágenes o solo tiene una, no hace nada.
   * @param i  Índice del proyecto
   * @returns
   *  @version 1.0.0
   *  @author Arlez Camilo Ceron Herrera
   */
  nextImage(i: number) {
    if (!this.projects[i] || this.projects[i].images.length < 2) return;
    this.selectedImageIndex[i] =
      (this.selectedImageIndex[i] + 1) % this.projects[i].images.length;
  }

  /**
   * Alterna el estado de "volteado" de la tarjeta del proyecto.
   * Si la tarjeta ya está volteada, la vuelve a su estado original.
   * @param i Índice del proyecto
   * @returns
   *  @version 1.0.0
   *  @author Arlez Camilo Ceron Herrera
   */
  flipCard(i: number) {
    if (typeof this.flipped[i] === 'undefined') return;
    this.flipped[i] = !this.flipped[i];
  }

  /**
   * Metodo para navegar a una página específica en el paginador.
   * Verifica que el número de página esté dentro del rango válido antes de cambiar la página
   * @param pageNum Número de página al que se desea navegar.
   * @returns
   *  @version 1.0.0
   *  @author Arlez Camilo Ceron Herrera
   */
  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.page = pageNum;
    }
  }

  /**
   * Navega a la primera página del paginador.
   * @returns
   *  @version 1.0.0
   *  @author Arlez Camilo Ceron Herrera
   */
  prevPage() {
    this.goToPage(this.page - 1);
  }

  /**
   * Navega a la última página del paginador.
   * @returns
   *  @version 1.0.0
   *  @author Arlez Camilo Ceron Herrera
   */
  nextPage() {
    this.goToPage(this.page + 1);
  }

  /**
   * Devuelve un array con los números de las páginas para el paginador.
   * Utiliza la propiedad `totalPages` para determinar cuántas páginas hay.
   * @returns Un array de números representando las páginas.
   *  @version 1.0.0
   *  @author Arlez Camilo Ceron Herrera
   */
  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
