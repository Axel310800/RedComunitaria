import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAutenticacionRepository } from '../../domain/repositories/autenticacion.repository';
import { Usuario, LoginRequest, LoginResponse } from '../../domain/models/usuario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionHttpAdapter implements IAutenticacionRepository {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/autenticacion`;

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  registrar(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registrar`, usuario);
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
