import { Provider } from '@angular/core';
import { IAutenticacionRepository } from '../domain/repositories/autenticacion.repository';
import { AutenticacionHttpAdapter } from '../presentation/adapters/autenticacion.http-adapter';
import { IOllaRepository } from '../domain/repositories/olla.repository';
import { OllaHttpAdapter } from '../presentation/adapters/olla.http-adapter';
import { IDonacionRepository } from '../domain/repositories/donacion.repository';
import { DonacionHttpAdapter } from '../presentation/adapters/donacion.http-adapter';

/**
 * Configuración de inyección de dependencias.
 * 
 * Este archivo centraliza la configuración de proveedores para toda la aplicación.
 * Vincula las interfaces de los repositorios del dominio con sus implementaciones concretas.
 */

export const dependencyInjectionProviders: Provider[] = [
  // Autenticación
  {
    provide: IAutenticacionRepository,
    useClass: AutenticacionHttpAdapter
  },

  // Ollas Comunes
  {
    provide: IOllaRepository,
    useClass: OllaHttpAdapter
  },

  // Donaciones
  {
    provide: IDonacionRepository,
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
