import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDonacionRepository } from '../../domain/repositories/donacion.repository';
import { Donacion, CreateDonacionRequest, DonacionListItem } from '../../domain/models/donacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonacionHttpAdapter implements IDonacionRepository {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/donaciones`;

  obtenerDonaciones(filtros?: any): Observable<DonacionListItem[]> {
    return this.http.get<DonacionListItem[]>(this.apiUrl, { params: filtros });
  }

  obtenerDonacionPorId(id: number): Observable<Donacion> {
    return this.http.get<Donacion>(`${this.apiUrl}/${id}`);
  }

  crearDonacion(request: CreateDonacionRequest): Observable<Donacion> {
    return this.http.post<Donacion>(this.apiUrl, request);
  }

  actualizarEstadoDonacion(id: number, estado: string): Observable<Donacion> {
    return this.http.put<Donacion>(`${this.apiUrl}/${id}`, { estado });
  }

  eliminarDonacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
