import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IOllaRepository } from '../repositories/olla.repository';
import { OllaComunas, CreateOllaRequest } from '../models/olla.model';
import { OLLA_REPOSITORY_TOKEN } from '../../infrastructure/injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class OllaService {
  private repository = inject(OLLA_REPOSITORY_TOKEN);

  obtenerOllas(filtros?: any): Observable<OllaComunas[]> {
    return this.repository.obtenerOllas(filtros);
  }

  obtenerOllaPorId(id: number): Observable<OllaComunas> {
    return this.repository.obtenerOllaPorId(id);
  }

  crearOlla(request: CreateOllaRequest): Observable<OllaComunas> {
    return this.repository.crearOlla(request);
  }

  actualizarOlla(id: number, request: CreateOllaRequest): Observable<OllaComunas> {
    return this.repository.actualizarOlla(id, request);
  }

  eliminarOlla(id: number): Observable<void> {
    return this.repository.eliminarOlla(id);
  }

  buscarOllas(termino: string): Observable<OllaComunas[]> {
    return this.repository.buscarOllas(termino);
  }
}
