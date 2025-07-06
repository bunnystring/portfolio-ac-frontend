import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';
import { lucideUser, lucideMail, lucideMessageCircle } from '@ng-icons/lucide';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact-me',
  imports: [NgIcon, CommonModule, ReactiveFormsModule ],
  templateUrl: './contact-me.html',
  styleUrl: './contact-me.scss',
  providers: [provideAnimations()],
  standalone: true,
  animations: [
    trigger('fadeInContainer', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
  ],
  viewProviders: [provideIcons({ lucideUser, lucideMail, lucideMessageCircle })],
})
export class ContactMe implements OnInit {
  contactForm: FormGroup;
  sending = false;
  sent = false;

  constructor(
    private fb: FormBuilder,
    private title: Title, private meta: Meta
  ){
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
   this.setMetaData();
  }

  /**
   * Método para establecer los metadatos de la página.
   * Configura el título y la descripción para SEO.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @returns {void}
   */
  setMetaData() {
    this.title.setTitle('Portfolio | Contact Me');
    this.meta.updateTag({ name: 'description', content: 'Bienvenido a mi portfolio. Descubre mis proyectos, habilidades y experiencia.' });
    this.meta.updateTag({ property: 'og:title', content: 'Portfolio | Contact Me' });
    this.meta.updateTag({ property: 'og:description', content: 'Bienvenido a mi portfolio. Descubre mis proyectos, habilidades y experiencia.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://tu-dominio.com/assets/images/contact.png' });
  }

  /**
   * Método para enviar el formulario de contacto.
   * Valida el formulario y simula el envío de datos.
   * Si el formulario es válido, se simula un envío exitoso y se resetea el formulario.
   * Si el envío es exitoso, se muestra un mensaje de confirmación
   * durante 3.5 segundos antes de ocultarlo.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   * @returns {void}
   * @description Este método se activa al hacer clic en el botón de enviar del formulario.
   */
  sendMessage() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.sending = true;
    // Simulación de envío, reemplaza por integración real (correo, API, etc)
    setTimeout(() => {
      this.sending = false;
      this.sent = true;
      this.contactForm.reset();
      setTimeout(() => this.sent = false, 3500);
    }, 1800);
  }
}
