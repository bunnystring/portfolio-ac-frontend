import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../components/services/auth-services/auth-service';

/**
 * Guardia de ruta que permite el acceso solo a usuarios no autenticados.
 * Redirige a la página de inicio si el usuario ya está autenticado.
 * @returns boolean | UrlTree
 */
export const guestGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? router.createUrlTree(['/home']) : true;
};
