import {
  Component,
  computed,
  effect,
  OnInit,
  OnDestroy,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth-services/auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequest } from '../../../models/auth.models';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
  import { animate, style, transition, trigger } from '@angular/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideMail,
  lucideMessageCircle,
  lucideUser,
  lucideLock,
  lucideLogIn,
} from '@ng-icons/lucide';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

/**
 * Interface de tipado estricto para el formulario de Login.
 * @version 1.0.0
 * @author Arlez Camilo Ceron Herrera
 */
interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
  remember: FormControl<boolean>;
}

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.html',
  // Mantengo tu propiedad tal como la tenías (styleUrl en singular)
  styleUrl: './login-component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon, RouterModule],
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
    trigger('fadeError', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '230ms ease-in',
          style({ opacity: 0, transform: 'translateY(-6px)' })
        ),
      ]),
    ]),
  ],
  providers: [provideAnimations()],
  viewProviders: [
    provideIcons({
      lucideUser,
      lucideMail,
      lucideMessageCircle,
      lucideLock,
      lucideLogIn,
    }),
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  // ---------------------------------------------------------------------------
  // Formulario tipado
  // ---------------------------------------------------------------------------
  form: FormGroup<LoginForm>;

  // ---------------------------------------------------------------------------
  // Signals de estado
  // ---------------------------------------------------------------------------
  loading: WritableSignal<boolean> = signal(false);
  errorMsg: WritableSignal<string | null> = signal(null);
  showPassword: WritableSignal<boolean> = signal(false);

  /**
   * Etiqueta dinámica del botón según estado loading.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  submitLabel: Signal<string> = computed(() =>
    this.loading() ? 'Ingresando...' : 'Entrar'
  );

  /**
   * Snapshot de los valores cuando ocurrió el último error.
   * Se usa para no limpiar el mensaje hasta que el usuario realmente modifique algo.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private lastErrorSnapshot = { email: '', pass: '' };

  /**
   * Tiempo (ms) que el mensaje de error permanece visible antes de auto-ocultarse.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private readonly ERROR_AUTO_DISMISS_MS = 5000;

  /**
   * Referencia al timeout activo del auto-dismiss (para limpiarlo si llega otro error).
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private errorDismissTimeout: any = null;

  /**
   * Effect reactivo que limpia el error cuando el usuario modifica email o password
   * después de que el mensaje se mostró. Mantiene tu lógica y estilo de comentarios.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private clearErrorOnUserChange = effect(() => {
    // Guard por seguridad (aunque form ya está inicializado en constructor)
    if (!this.form) return;

    const emailVal = this.form.controls.email.value;
    const passVal = this.form.controls.password.value;

    // Si hay un error visible y el usuario cambió algún campo respecto al snapshot guardado
    if (
      this.errorMsg() &&
      (emailVal !== this.lastErrorSnapshot.email ||
        passVal !== this.lastErrorSnapshot.pass)
    ) {
      this.clearErrorMessage(); // Limpia mensaje y timeout
    }
    // Actualiza el snapshot con los valores actuales
    if (!this.errorMsg()) {
      this.lastErrorSnapshot = { email: emailVal, pass: passVal };
    }
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      remember: this.fb.nonNullable.control(false),
    });
  }

  /**
   * Ciclo de vida: OnInit
   * Restaura email recordado (si existe).
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngOnInit(): void {
    this.restoreRememberedEmail();
  }

  /**
   * Ciclo de vida: OnDestroy
   * Limpia timeouts activos del auto-dismiss para evitar fugas.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  ngOnDestroy(): void {
    this.clearErrorTimeout();
  }

  // ---------------------------------------------------------------------------
  // Getters / Utilidades de acceso
  // ---------------------------------------------------------------------------

  /**
   * (A) Getter dinámico que controla el estado disabled del botón submit.
   * No depende de inicialización temprana fuera del constructor.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  get disabledSubmit(): boolean {
    return !this.form || this.form.invalid || this.loading();
  }

  /**
   * Método para obtener todos los controles del formulario.
   * @returns Controles del form.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  get f() {
    return this.form.controls;
  }

  /**
   * Método para alternar la visibilidad de la contraseña.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }

  // ---------------------------------------------------------------------------
  // Funciones de inicialización / helpers
  // ---------------------------------------------------------------------------

  /**
   * Restaura el email recordado del almacenamiento local.
   * Si existe, lo establece en el campo de email y activa la opción remember.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private restoreRememberedEmail(): void {
    const savedEmail = localStorage.getItem('last_login_email');
    if (savedEmail) {
      this.form.controls.email.setValue(savedEmail);
      this.form.controls.remember.setValue(true);
    }
  }

  /**
   * Construye el objeto de solicitud de inicio de sesión.
   * @returns Objeto con las credenciales del usuario.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private buildRequestBody(): LoginRequest {
    return {
      email: this.f.email.value,
      password: this.f.password.value,
    };
  }

  // ---------------------------------------------------------------------------
  // Acción principal: submit
  // ---------------------------------------------------------------------------

  /**
   * Método para enviar el formulario de inicio de sesión.
   * 1. Valida estado.
   * 2. Limpia error previo.
   * 3. Marca loading.
   * 4. Intenta autenticación y maneja respuesta.
   * Redirige al usuario a /home (o returnUrl) al iniciar sesión exitoso.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  submit(): void {
    if (this.disabledSubmit) return;

    // Limpiamos error previo y marcamos loading
    this.clearErrorMessage();
    this.loading.set(true);

    // Al iniciar un intento de login tomamos snapshot actual (por si se produce error lo conservamos)
    this.lastErrorSnapshot = {
      email: this.f.email.value,
      pass: this.f.password.value,
    };

    const payload = this.buildRequestBody();

    this.auth
      .login(payload)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          if (this.f.remember.value) {
            localStorage.setItem('last_login_email', this.f.email.value);
          } else {
            localStorage.removeItem('last_login_email');
          }
          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err: HttpErrorResponse) => {
          const backendMsg =
            err?.error &&
            typeof err.error === 'object' &&
            (err.error as any).message
              ? (err.error as any).message
              : (typeof err.error === 'string'
                  ? err.error
                  : 'Error desconocido');

          this.setErrorMessageWithAutoDismiss(backendMsg);
        },
      });
  }

  // ---------------------------------------------------------------------------
  // Manejo del mensaje de error (auto-dismiss + limpieza manual)
  // ---------------------------------------------------------------------------

  /**
   * Establece el mensaje de error y activa auto-ocultado tras ERROR_AUTO_DISMISS_MS.
   * Respeta un mensaje nuevo si llega antes de que venza el tiempo del anterior.
   * @param msg Mensaje a mostrar.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private setErrorMessageWithAutoDismiss(msg: string): void {
    this.errorMsg.set(msg);
    this.clearErrorTimeout();
    this.errorDismissTimeout = setTimeout(() => {
      // Solo se limpia si no cambió el mensaje entre tanto
      if (this.errorMsg() === msg) {
        this.errorMsg.set(null);
      }
      this.errorDismissTimeout = null;
    }, this.ERROR_AUTO_DISMISS_MS);
  }

  /**
   * Limpia el mensaje de error y cancela cualquier timeout de auto-dismiss.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private clearErrorMessage(): void {
    this.clearErrorTimeout();
    this.errorMsg.set(null);
  }

  /**
   * Cancela el timeout de auto-dismiss (si está activo).
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private clearErrorTimeout(): void {
    if (this.errorDismissTimeout) {
      clearTimeout(this.errorDismissTimeout);
      this.errorDismissTimeout = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Validación auxiliar
  // ---------------------------------------------------------------------------

  /**
   * Método para validar si un control del formulario es inválido.
   * @param ctrl Control del formulario a validar.
   * @returns true si el control es inválido y ha sido tocado o modificado.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  controlInvalid(ctrl: FormControl<any>): boolean {
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }
}
