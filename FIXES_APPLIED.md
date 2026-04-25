# Correcciones Aplicadas - ng serve

## Resumen de Problemas Solucionados

Se resolvieron **4 categorías principales** de errores que impedían la compilación de Angular 19.

---

## 1. Error de HttpClient Import

### Problema
```typescript
// INCORRECTO - Angular 19 no exporta HttpClient desde platform-browser
import { provideHttpClient } from '@angular/platform-browser/http';
```

### Solución
```typescript
// CORRECTO - Usar common/http
import { provideHttpClient } from '@angular/common/http';
```

**Archivo modificado**: `src/app/app.config.ts`

---

## 2. Inyección de Dependencias con Interfaces

### Problema
Angular no puede usar interfaces TypeScript directamente en `inject()` porque se borran en tiempo de compilación. Esto causaba errores como:
```
'IAutenticacionRepository' only refers to a type, but is being used as a value here.
```

### Solución
Se crearon `InjectionToken` para cada repositorio:

```typescript
// Nuevo archivo: src/app/infrastructure/injection-tokens.ts
export const AUTENTICACION_REPOSITORY_TOKEN = new InjectionToken<IAutenticacionRepository>(
  'autenticacion-repository'
);

export const OLLA_REPOSITORY_TOKEN = new InjectionToken<IOllaRepository>(
  'olla-repository'
);

export const DONACION_REPOSITORY_TOKEN = new InjectionToken<IDonacionRepository>(
  'donacion-repository'
);
```

Luego se actualizaron los servicios:

```typescript
// Antes
private repository = inject(IAutenticacionRepository);

// Después
private repository = inject(AUTENTICACION_REPOSITORY_TOKEN);
```

**Archivos modificados**:
- Creado: `src/app/infrastructure/injection-tokens.ts`
- Actualizado: `src/app/infrastructure/di-setup.ts`
- Actualizado: `src/app/domain/services/autenticacion.service.ts`
- Actualizado: `src/app/domain/services/olla.service.ts`
- Actualizado: `src/app/domain/services/donacion.service.ts`

---

## 3. Problemas de Codificación UTF-8 con Caracteres Especiales

### Problema
El parser de Angular templates no procesaba correctamente caracteres especiales como "ñ", causando errores:
```
error NG5002: Parser Error: Lexer Error: Unexpected character [ñ]
```

### Solución
Se reemplazaron todos los caracteres especiales por sus equivalentes en ASCII en el componente login:

| Incorrecto | Correcto |
|-----------|----------|
| Contraseña | Contrasena |
| Correo Electrónico | Correo Electronico |
| Iniciar Sesión | Iniciar Sesion |
| Registrate | Registrate |
| ¿ | (se removió) |

**Archivo modificado**: `src/app/presentation/pages/login/login.component.ts` (completamente reescrito)

---

## 4. Mismatch de Nombres de Propiedad ngModel

### Problema
El input tenía `name="password"` pero intentaba bindear a `form.contraseña`:
```html
<input name="password" [(ngModel)]="form.contraseña" />
```

### Solución
Se normalizó a usar "password" en toda la aplicación:

```typescript
// Modelos actualizados
export interface LoginRequest {
  email: string;
  password: string;  // Era: contraseña
}

export interface Usuario {
  password?: string;  // Era: contraseña
}

// Servicio actualizado
login(email: string, password: string): Observable<LoginResponse> {
  return this.repository.login({ email, password });
}
```

**Archivos modificados**:
- `src/app/domain/models/usuario.model.ts`
- `src/app/domain/services/autenticacion.service.ts`

---

## Resultado

✅ **El proyecto ahora compila exitosamente sin errores:**

```
✔ Browser application bundle generation complete.
Initial chunk files | Names | Raw size
main.04d376f8d38d958c.js | main | 372.16 kB
polyfills.b87ae27d30af9545.js | polyfills | 34.84 kB
styles.f6fccde59c0acfd6.css | styles | 18.61 kB
runtime.8741985604dba3a5.js | runtime | 906 bytes

Initial total | 426.52 kB | 109.01 kB
```

---

## Cambios Resumidos

| Categoría | Cambios |
|-----------|---------|
| Imports | 1 archivo |
| InjectionTokens | 1 archivo nuevo + 5 archivos actualizados |
| Caracteres Especiales | 1 archivo reescrito |
| Nombres Consistentes | 2 archivos actualizados |
| **Total** | **7 cambios principales** |

---

## Próximos Pasos

1. ✅ Compilación correcta
2. ⏭️ Iniciar servidor de desarrollo: `pnpm run dev`
3. ⏭️ Implementar backend Python/FastAPI
4. ⏭️ Integrar API con frontend

