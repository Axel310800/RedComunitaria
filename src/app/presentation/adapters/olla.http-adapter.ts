import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOllaRepository } from '../../domain/repositories/olla.repository';
import { OllaComunas, CreateOllaRequest } from '../../domain/models/olla.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OllaHttpAdapter implements IOllaRepository {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ollas`;

  obtenerOllas(filtros?: any): Observable<OllaComunas[]> {
    return this.http.get<OllaComunas[]>(this.apiUrl, { params: filtros });
  }

  obtenerOllaPorId(id: number): Observable<OllaComunas> {
    return this.http.get<OllaComunas>(`${this.apiUrl}/${id}`);
  }

  crearOlla(request: CreateOllaRequest): Observable<OllaComunas> {
    return this.http.post<OllaComunas>(this.apiUrl, request);
  }

  actualizarOlla(id: number, request: CreateOllaRequest): Observable<OllaComunas> {
    return this.http.put<OllaComunas>(`${this.apiUrl}/${id}`, request);
  }

  eliminarOlla(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarOllas(termino: string): Observable<OllaComunas[]> {
    return this.http.get<OllaComunas[]>(`${this.apiUrl}/buscar`, {
      params: { termino }
    });
  }
}
