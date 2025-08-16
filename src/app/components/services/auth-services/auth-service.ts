import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from '../../models/auth.models';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    this.initFromStorage();
  }

  private userSignal = signal<AuthUser | null>(null);
  private tokenSignal = signal<string | null>(null);
  private expirationSignal = signal<number | null>(null);
  private logoutTimer: any = null;

  user = this.userSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  tokenExpiration = this.expirationSignal.asReadonly();

  getUser(): AuthUser | null {
    return this.userSignal();
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Realiza el login del usuario.
   * @param body Objeto que contiene las credenciales de login.
   * @returns Observable con la respuesta del login.
   * * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.API_URL}/auth/login`, body)
      .pipe(
        tap((res) => {
          this.storeSession(res);
          this.scheduleAutoLogout();
        }),
        catchError((err) => {
          return throwError(() => err);
        })
      );
  }

  /**
   * Realiza el logout del usuario.
   * @param navigateToLogin
   * * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  logout(navigateToLogin = true) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.clearAutoLogout();
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.expirationSignal.set(null);
    if (navigateToLogin) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns true si el usuario está autenticado, false en caso contrario.
   * * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  isAuthenticated(): boolean {
    const token = this.tokenSignal();
    if (!token) return false;
    if (this.isTokenExpired()) {
      // Limpieza defensiva
      this.logout(false);
      return false;
    }
    return true;
  }

  /**
   * Almacena la sesión del usuario en el almacenamiento local.
   * @param res Objeto que contiene la respuesta del login.
   * * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private storeSession(res: LoginResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.tokenSignal.set(res.token);
    this.userSignal.set(res.user);

    const expMs = this.getTokenExpiration(res.token);
    this.expirationSignal.set(expMs);
  }

  /**
   * Inicializa el estado de autenticación desde el almacenamiento local.
   * @returns void
   * * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private initFromStorage() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (!token || !userRaw) return;

    const expMs = this.getTokenExpiration(token);
    // Si no se pudo obtener exp (token sin exp) asumimos válido hasta logout manual
    if (expMs && Date.now() >= expMs) {
      this.logout(false);
      return;
    }
    this.tokenSignal.set(token);
    try {
      this.userSignal.set(JSON.parse(userRaw) as AuthUser);
    } catch {
      this.userSignal.set(null);
    }
    this.expirationSignal.set(expMs);
    this.scheduleAutoLogout(); // programa con el tiempo restante
  }

  /**
   * Programa el logout automático del usuario.
   * @returns void
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private scheduleAutoLogout() {
    this.clearAutoLogout();
    const expMs = this.expirationSignal();
    if (!expMs) return; // token sin exp => no se programa
    const remaining = expMs - Date.now();
    if (remaining <= 0) {
      this.logout(false);
      return;
    }
    this.logoutTimer = setTimeout(() => {
      this.logout(true);
    }, remaining);
  }

  /**
   * Limpia el logout automático del usuario.
   * @returns void
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private clearAutoLogout() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  /**
   * Obtiene la fecha de expiración del token.
   * @param token El token JWT.
   * @returns La fecha de expiración en milisegundos o null si no se puede determinar.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private getTokenExpiration(token: string): number | null {
    try {
      const payload = this.decodeJwt(token);
      // exp en segundos (Unix epoch)
      if (payload && typeof payload.exp === 'number') {
        return payload.exp * 1000;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Verifica si el token ha expirado.
   * @returns true si el token ha expirado, false en caso contrario.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private isTokenExpired(): boolean {
    const expMs = this.expirationSignal();
    return !!(expMs && Date.now() >= expMs);
  }

  /**
   * Decodifica un token JWT.
   * @param token El token JWT.
   * @returns El payload decodificado o null si no se puede decodificar.
   * @version 1.0.0
   * @author Arlez Camilo Ceron Herrera
   */
  private decodeJwt(token: string): any | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Manejar padding
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );
    const json = atob(padded);
    return JSON.parse(json);
  }
}
