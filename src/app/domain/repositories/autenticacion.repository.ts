import { Observable } from 'rxjs';
import { Usuario, LoginRequest, LoginResponse } from '../models/usuario.model';

export interface IAutenticacionRepository {
  login(request: LoginRequest): Observable<LoginResponse>;
  registrar(usuario: Partial<Usuario>): Observable<LoginResponse>;
  obtenerUsuarioActual(): Observable<Usuario>;
  actualizarPerfil(usuario: Partial<Usuario>): Observable<Usuario>;
  logout(): Observable<void>;
  verificarToken(token: string): Observable<boolean>;
}
