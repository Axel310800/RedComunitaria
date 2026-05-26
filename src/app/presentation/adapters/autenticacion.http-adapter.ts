import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAutenticacionRepository } from '../../domain/repositories/autenticacion.repository';
import { Usuario, LoginRequest, LoginResponse } from '../../domain/models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionHttpAdapter implements IAutenticacionRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

login(request: LoginRequest): Observable<LoginResponse> {
  const body = {
    email: request.email,
    password: request.password
  };

  return this.http.post<any>(`${this.apiUrl}/login`, body)
    .pipe(
      map((response: any) => ({
        token: response.access_token,
        usuario: response.usuario
      }))
    );
}

registrar(usuario: Partial<Usuario>): Observable<LoginResponse> {
  return this.http.post<any>(`${this.apiUrl}/register`, usuario)
    .pipe(
      map((response: any) => ({
        token: response.access_token,
        usuario: response.usuario
      }))
    );
}

actualizarPerfil(usuario: Partial<Usuario>): Observable<Usuario> {
  return this.http.patch<Usuario>(`${this.apiUrl}/usuario`, usuario);
}

obtenerUsuarioActual(): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.apiUrl}/usuario`);
}

logout(): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/logout`, {});
}

verificarToken(token: string): Observable<boolean> {
  return this.http.post<boolean>(`${this.apiUrl}/verificar-token`, { token });
}
}
