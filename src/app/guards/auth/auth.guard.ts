import { AuthService } from '../../components/services/auth-services/auth-service';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';


/**
 * Guardia de ruta que verifica si el usuario está autenticado.
 * @param _route
 * @param state
 * @returns
 */
export const authGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if(auth.isAuthenticated()){
    return true;
  }
  
  return router.createUrlTree(['login'], {
    queryParams: { returnUrl: state.url || '/' },
  });
};
