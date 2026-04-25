export interface OllaComunas {
  id?: number;
  nombre: string;
  responsable: string;
  ubicacion: string;
  direccion: string;
  numeroBeneficiarios: number;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  estado: 'VALIDADA' | 'PENDIENTE';
  fechaCreacion?: Date;
  necesidades: Necesidad[];
  stock: StockDisponible[];
}

export interface Necesidad {
  id?: number;
  ollaId?: number;
  tipoNecesidad: string;
  descripcion: string;
  prioridad: string;
}

export interface StockDisponible {
  id?: number;
  ollaId?: number;
  tipoRecurso: string;
  cantidadKg: number;
  fechaActualizacion?: Date;
}

export interface CreateOllaRequest {
  nombre: string;
  responsable: string;
  ubicacion: string;
  direccion: string;
  numeroBeneficiarios: number;
  necesidadesPrincipales: string;
}
