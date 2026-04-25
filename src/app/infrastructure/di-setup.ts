import { Provider } from '@angular/core';
import { AutenticacionHttpAdapter } from '../presentation/adapters/autenticacion.http-adapter';
import { OllaHttpAdapter } from '../presentation/adapters/olla.http-adapter';
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
 * Vincula los tokens de los repositorios del dominio con sus implementaciones concretas.
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
