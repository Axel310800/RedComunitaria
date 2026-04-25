export interface Usuario {
  id?: number;
  email: string;
  nombre: string;
  contraseña?: string;
  rol: 'admin' | 'donante' | 'voluntario';
  fechaCreacion?: Date;
}

export interface LoginRequest {
  email: string;
  contraseña: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}
