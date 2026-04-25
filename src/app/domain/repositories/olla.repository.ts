import { Observable } from 'rxjs';
import { OllaComunas, CreateOllaRequest } from '../models/olla.model';

export interface IOllaRepository {
  obtenerOllas(filtros?: any): Observable<OllaComunas[]>;
  obtenerOllaPorId(id: number): Observable<OllaComunas>;
  crearOlla(request: CreateOllaRequest): Observable<OllaComunas>;
  actualizarOlla(id: number, request: CreateOllaRequest): Observable<OllaComunas>;
  eliminarOlla(id: number): Observable<void>;
  buscarOllas(termino: string): Observable<OllaComunas[]>;
}
