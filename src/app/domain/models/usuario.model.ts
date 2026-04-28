export interface Usuario {
  id?: number;
  email: string;
  nombre: string;
  password?: string;
  rol: 'admin' | 'donante' | 'responsable';
  fechaCreacion?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
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