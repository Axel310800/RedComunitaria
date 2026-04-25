import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IAutenticacionRepository } from '../repositories/autenticacion.repository';
import { Usuario, LoginRequest, LoginResponse, AuthState } from '../models/usuario.model';
import { AUTENTICACION_REPOSITORY_TOKEN } from '../../infrastructure/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private repository = inject(AUTENTICACION_REPOSITORY_TOKEN);
  private authState$ = new BehaviorSubject<AuthState>({
    usuario: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token')
  });

  getAuthState$(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  isAuthenticated(): boolean {
    return this.authState$.value.isAuthenticated;
  }

  getToken(): string | null {
    return this.authState$.value.token;
  }

  login(email: string, contraseña: string): Observable<LoginResponse> {
    return this.repository.login({ email, contraseña })
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          this.authState$.next({
            usuario: response.usuario,
            token: response.token,
            isAuthenticated: true
          });
        })
      );
  }

  registrar(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.repository.registrar(usuario);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
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
