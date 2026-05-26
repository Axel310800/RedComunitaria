import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario, LoginResponse, AuthState } from '../models/usuario.model';
import { AUTENTICACION_REPOSITORY_TOKEN } from '../../infrastructure/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private readonly repository = inject(AUTENTICACION_REPOSITORY_TOKEN);
  private readonly authState$ = new BehaviorSubject<AuthState>({
    usuario: this.loadStoredUser(),
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token')
  });

  private loadStoredUser(): Usuario | null {
    const stored = localStorage.getItem('auth_user');
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as Usuario;
    } catch {
      return null;
    }
  }

  getAuthState$(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  isAuthenticated(): boolean {
    return this.authState$.value.isAuthenticated;
  }

  getToken(): string | null {
    return this.authState$.value.token;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.repository.login({ email, password: password })
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('auth_user', JSON.stringify(response.usuario));
          this.authState$.next({
            usuario: response.usuario,
            token: response.token,
            isAuthenticated: true
          });
        })
      );
  }

  registrar(usuario: Partial<Usuario>): Observable<LoginResponse> {
    return this.repository.registrar(usuario)
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('auth_user', JSON.stringify(response.usuario));
          this.authState$.next({
            usuario: response.usuario,
            token: response.token,
            isAuthenticated: true
          });
        })
      );
  }

  actualizarPerfil(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.repository.actualizarPerfil(usuario)
      .pipe(
        tap(updatedUser => {
          const currentState = this.authState$.value;
          if (currentState.token) {
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
            this.authState$.next({
              ...currentState,
              usuario: updatedUser
            });
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.authState$.next({
      usuario: null,
      token: null,
      isAuthenticated: false
    });
  }

  obtenerUsuarioActual(): Observable<Usuario> {
    return this.repository.obtenerUsuarioActual();
  }
}
