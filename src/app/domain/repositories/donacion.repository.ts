import { Observable } from 'rxjs';
import { Donacion, CreateDonacionRequest, DonacionListItem } from '../models/donacion.model';

export interface IDonacionRepository {
  obtenerDonaciones(filtros?: any): Observable<DonacionListItem[]>;
  obtenerDonacionPorId(id: number): Observable<Donacion>;
  crearDonacion(request: CreateDonacionRequest): Observable<Donacion>;
  actualizarEstadoDonacion(id: number, estado: string): Observable<Donacion>;
  eliminarDonacion(id: number): Observable<void>;
}
