import { InjectionToken } from '@angular/core';
import { IAutenticacionRepository } from '../domain/repositories/autenticacion.repository';
import { IOllaRepository } from '../domain/repositories/olla.repository';
import { IDonacionRepository } from '../domain/repositories/donacion.repository';

export const AUTENTICACION_REPOSITORY_TOKEN = new InjectionToken<IAutenticacionRepository>(
  'IAutenticacionRepository'
);

export const OLLA_REPOSITORY_TOKEN = new InjectionToken<IOllaRepository>(
  'IOllaRepository'
);

export const DONACION_REPOSITORY_TOKEN = new InjectionToken<IDonacionRepository>(
  'IDonacionRepository'
);
