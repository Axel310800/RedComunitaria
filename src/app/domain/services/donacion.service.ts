import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IDonacionRepository } from '../repositories/donacion.repository';
import { Donacion, CreateDonacionRequest, DonacionListItem } from '../models/donacion.model';

@Injectable({
  providedIn: 'root'
})
export class DonacionService {
  private repository = inject(IDonacionRepository);

  obtenerDonaciones(filtros?: any): Observable<DonacionListItem[]> {
    return this.repository.obtenerDonaciones(filtros);
  }

  obtenerDonacionPorId(id: number): Observable<Donacion> {
    return this.repository.obtenerDonacionPorId(id);
  }

  crearDonacion(request: CreateDonacionRequest): Observable<Donacion> {
    return this.repository.crearDonacion(request);
  }

  actualizarEstadoDonacion(id: number, estado: string): Observable<Donacion> {
    return this.repository.actualizarEstadoDonacion(id, estado);
  }

  eliminarDonacion(id: number): Observable<void> {
    return this.repository.eliminarDonacion(id);
  }
}
