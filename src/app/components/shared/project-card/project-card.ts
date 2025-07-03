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
          title: 'Portfolio Angular',
          images: [
            '/assets/images/angularRank.png',
            '/assets/images/javaScriptRank.png',
            '/assets/images/bootstrapRank.png',
          ],
          description:
            'Un portafolio moderno hecho con Angular 20 y Bootstrap 5. Incluye animaciones, responsive design y una mascota interactiva.',
          demoLink: 'https://tu-demo-angular.com',
          repoLink: 'https://github.com/bunnystring/portfolio-angular',
          createdAt: '2024-09-01',
          updatedAt: '2025-06-01',
        },
        {
          title: 'ToDo App',
          images: [
            'https://picsum.photos/seed/todo1/400/250',
            'https://picsum.photos/seed/todo2/400/250',
          ],
          description:
            'Aplicación para organizar tareas, con autenticación, drag & drop y sincronización en la nube (Firebase).',
          demoLink: 'https://tu-todo-app.com',
          repoLink: 'https://github.com/bunnystring/todo-app',
          createdAt: '2024-05-10',
          updatedAt: '2025-05-12',
        },
        {
          title: 'E-commerce Angular',
          images: [
            'https://picsum.photos/seed/ecommerce1/400/250',
            'https://picsum.photos/seed/ecommerce2/400/250',
            'https://picsum.photos/seed/todo2/400/250',
            'https://picsum.photos/seed/todo2/400/250',
          ],
          description:
            'Tienda online con Angular, carrito de compras, pasarela de pago y gestión de productos.',
          demoLink: 'https://tu-ecommerce-angular.com',
          repoLink: '',
          createdAt: '',
          updatedAt: '',
        },
        {
          title: 'Blog Angular',
          images: [
            'https://picsum.photos/seed/blog1/400/250',
            'https://picsum.photos/seed/blog2/400/250',
          ],
          description:
            'Blog personal con Angular, autenticación, comentarios y gestión de publicaciones.',
          demoLink: 'https://tu-blog-angular.com',
          repoLink: '',
          createdAt: '',
          updatedAt: '',
        },
        {
          title: 'Chat App',
          images: [
            'https://picsum.photos/seed/chat1/400/250',
            'https://picsum.photos/seed/chat2/400/250',
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
            'https://picsum.photos/seed/weather1/400/250',
            'https://picsum.photos/seed/weather2/400/250',
          ],
          description:
            'Aplicación del clima con Angular, API de clima y geolocalización.',
          demoLink: 'https://tu-weather-app.com',
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
