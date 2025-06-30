import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-me',
  imports: [NgIcon, CommonModule, ReactiveFormsModule ],
  templateUrl: './contact-me.html',
  styleUrl: './contact-me.scss',
  standalone: true,
})
export class ContactMe {
  contactForm: FormGroup;
  sending = false;
  sent = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
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
