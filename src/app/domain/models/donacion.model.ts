export interface Donacion {
  id?: number;
  donante: string;
  email: string;
  telefono: string;
  recurso: string;
  cantidad: number;
  ollaDestino: number;
  mensaje?: string;
  estado: 'ENTREGADA' | 'PENDIENTE' | 'EN_TRÁNSITO';
  fechaDonacion?: Date;
  fechaCreacion?: Date;
}

export interface CreateDonacionRequest {
  donante: string;
  email: string;
  telefono: string;
  recurso: string;
  cantidad: number;
  ollaDestino: number;
  mensaje?: string;
}

export interface DonacionListItem {
  id: number;
  donante: string;
  recurso: string;
  cantidad: number;
  ollaDestino: string;
  estado: string;
  fechaDonacion: string;
}
