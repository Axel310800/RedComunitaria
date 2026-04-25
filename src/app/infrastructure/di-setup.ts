import { Provider } from '@angular/core';
import { IAutenticacionRepository } from '../domain/repositories/autenticacion.repository';
import { AutenticacionHttpAdapter } from '../presentation/adapters/autenticacion.http-adapter';
import { IOllaRepository } from '../domain/repositories/olla.repository';
import { OllaHttpAdapter } from '../presentation/adapters/olla.http-adapter';
import { IDonacionRepository } from '../domain/repositories/donacion.repository';
import { DonacionHttpAdapter } from '../presentation/adapters/donacion.http-adapter';
import {
  AUTENTICACION_REPOSITORY_TOKEN,
  OLLA_REPOSITORY_TOKEN,
  DONACION_REPOSITORY_TOKEN
} from './injection-tokens';

/**
 * Configuración de inyección de dependencias.
 * 
 * Este archivo centraliza la configuración de proveedores para toda la aplicación.
 * Vincula las interfaces de los repositorios del dominio con sus implementaciones concretas.
 */

export const dependencyInjectionProviders: Provider[] = [
  // Autenticación
  {
    provide: AUTENTICACION_REPOSITORY_TOKEN,
    useClass: AutenticacionHttpAdapter
  },

  // Ollas Comunes
  {
    provide: OLLA_REPOSITORY_TOKEN,
    useClass: OllaHttpAdapter
  },

  // Donaciones
  {
    provide: DONACION_REPOSITORY_TOKEN,
    useClass: DonacionHttpAdapter
  }
];

/**
 * Para usar en app.config.ts:
 * 
 * import { dependencyInjectionProviders } from './infrastructure/di-setup';
 * 
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     // ... otros providers
 *     ...dependencyInjectionProviders,
 *   ]
 * };
 */
