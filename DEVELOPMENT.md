# Guía de Desarrollo - RedComunitaria

## Flujo de Desarrollo

Este documento describe cómo continuar desarrollando el proyecto siguiendo la arquitectura hexagonal implementada.

---

## 1. Agregar una Nueva Funcionalidad

### Ejemplo: Sistema de Notificaciones

#### Paso 1: Crear el Modelo de Dominio

**File: `src/app/domain/models/notificacion.model.ts`**
```typescript
export interface Notificacion {
  id?: number;
  usuarioId: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  leida: boolean;
  fechaCreacion?: Date;
}
```

#### Paso 2: Crear la Interfaz del Repositorio

**File: `src/app/domain/repositories/notificacion.repository.ts`**
```typescript
import { Observable } from 'rxjs';
import { Notificacion } from '../models/notificacion.model';

export interface INotificacionRepository {
  obtenerNotificaciones(): Observable<Notificacion[]>;
  marcarComoLeida(id: number): Observable<void>;
  eliminar(id: number): Observable<void>;
}
```

#### Paso 3: Crear el Servicio de Aplicación

**File: `src/app/domain/services/notificacion.service.ts`**
```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { INotificacionRepository } from '../repositories/notificacion.repository';
import { Notificacion } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private repository = inject(INotificacionRepository);

  obtenerNotificaciones(): Observable<Notificacion[]> {
    return this.repository.obtenerNotificaciones();
  }

  marcarComoLeida(id: number): Observable<void> {
    return this.repository.marcarComoLeida(id);
  }

  eliminar(id: number): Observable<void> {
    return this.repository.eliminar(id);
  }
}
```

#### Paso 4: Crear el Adaptador HTTP

**File: `src/app/presentation/adapters/notificacion.http-adapter.ts`**
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INotificacionRepository } from '../../domain/repositories/notificacion.repository';
import { Notificacion } from '../../domain/models/notificacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacionHttpAdapter implements INotificacionRepository {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notificaciones`;

  obtenerNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }

  marcarComoLeida(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/leida`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

#### Paso 5: Registrar en DI

**File: `src/app/infrastructure/di-setup.ts`** - Agregar:
```typescript
import { INotificacionRepository } from '../domain/repositories/notificacion.repository';
import { NotificacionHttpAdapter } from '../presentation/adapters/notificacion.http-adapter';

export const dependencyInjectionProviders: Provider[] = [
  // ... proveedores existentes
  {
    provide: INotificacionRepository,
    useClass: NotificacionHttpAdapter
  }
];
```

#### Paso 6: Crear Componente de Presentación

**File: `src/app/presentation/components/notifications/notification-bell.component.ts`**
```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionService } from '../../../domain/services/notificacion.service';
import { Notificacion } from '../../../domain/models/notificacion.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button class="relative">
        <span>🔔</span>
        <span *ngIf="notificaciones.length > 0" 
              class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs">
          {{ notificaciones.length }}
        </span>
      </button>
      
      <div *ngIf="mostrarDropdown" class="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4">
        <div *ngFor="let notif of notificaciones" class="mb-2 p-2 border-b">
          <h4 class="font-bold">{{ notif.titulo }}</h4>
          <p class="text-sm text-gray-600">{{ notif.mensaje }}</p>
          <button (click)="marcarComoLeida(notif.id!)" class="text-xs text-primary">
            Marcar como leída
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotificationBellComponent implements OnInit {
  private notificacionService = inject(NotificacionService);
  
  notificaciones: Notificacion[] = [];
  mostrarDropdown = false;

  ngOnInit() {
    this.cargarNotificaciones();
  }

  cargarNotificaciones() {
    this.notificacionService.obtenerNotificaciones().subscribe(data => {
      this.notificaciones = data;
    });
  }

  marcarComoLeida(id: number) {
    this.notificacionService.marcarComoLeida(id).subscribe(() => {
      this.cargarNotificaciones();
    });
  }
}
```

---

## 2. Agregar una Nueva Página

### Estructura Base

```bash
# Crear carpeta
mkdir -p src/app/presentation/pages/nueva-pagina

# Crear componente
touch src/app/presentation/pages/nueva-pagina/nueva-pagina.component.ts
```

### Componente Base

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importar servicios necesarios

@Component({
  selector: 'app-nueva-pagina',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Tu contenido aquí -->
    </div>
  `,
  styles: []
})
export class NuevaPaginaComponent implements OnInit {
  // Tu lógica aquí

  ngOnInit() {
    // Inicialización
  }
}
```

### Registrar en Rutas

**File: `src/app/app.routes.ts`**
```typescript
import { NuevaPaginaComponent } from './presentation/pages/nueva-pagina/nueva-pagina.component';

export const routes: Routes = [
  // ... rutas existentes
  { path: 'nueva-pagina', component: NuevaPaginaComponent, canActivate: [authGuard] },
];
```

---

## 3. Agregar un Nuevo Endpoint

### En el Backend

#### Paso 1: Entidad
```python
# src/domain/entities/nueva.py
@dataclass
class Nueva:
    id: Optional[int] = None
    nombre: str = ""
    # ... más campos
```

#### Paso 2: Repositorio (Interfaz)
```python
# src/domain/repositories/nueva_repository.py
class NuevaRepository(ABC):
    @abstractmethod
    async def obtener_todas(self) -> List[Nueva]:
        pass
    # ... más métodos
```

#### Paso 3: Implementación MySQL
```python
# src/adapters/database/mysql_nueva_repository.py
class MysqlNuevaRepository(NuevaRepository):
    def __init__(self, db: Session):
        self.db = db
    
    async def obtener_todas(self) -> List[Nueva]:
        modelos = self.db.query(NuevaModel).all()
        return [self._mapear(m) for m in modelos]
    # ... más métodos
```

#### Paso 4: Rutas
```python
# src/adapters/http/routes/nueva_routes.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/nuevas", tags=["nuevas"])

@router.get("")
async def obtener_nuevas(db: Session = Depends(get_db)):
    # Tu lógica aquí
    pass
```

#### Paso 5: Main
```python
# src/main.py
from src.adapters.http.routes import nueva_routes

app.include_router(nueva_routes.router)
```

---

## 4. Mejores Prácticas

### Estructura de Carpetas

```
Por cada feature:
├── domain/
│   ├── models/
│   ├── repositories/
│   └── services/
├── presentation/
│   ├── components/
│   ├── pages/
│   ├── adapters/
│   └── guards/
└── infrastructure/
    └── config/
```

### Nomenclatura

- **Interfaces**: `IXxx` o `XxxRepository`
- **Implementaciones**: `XxxHttpAdapter` o `XxxService`
- **Componentes**: `XxxComponent`
- **Servicios**: `XxxService`

### Dependencias

```typescript
// ✅ BIEN: Inyectar interfaces
constructor(private repo: IXxxRepository) {}

// ❌ MAL: Inyectar clases concretas
constructor(private repo: XxxHttpAdapter) {}
```

### Observable Handling

```typescript
// ✅ BIEN: Usar async pipe
<div>{{ data$ | async }}</div>

// También BIEN: Unsubscribe en OnDestroy
ngOnDestroy() {
  this.subscription.unsubscribe();
}

// ❌ MAL: Subscribe en template
{{ data.subscribe() }}
```

---

## 5. Testing

### Unit Tests

**File: `src/app/domain/services/olla.service.spec.ts`**
```typescript
import { TestBed } from '@angular/core/testing';
import { OllaService } from './olla.service';
import { IOllaRepository } from '../repositories/olla.repository';
import { of } from 'rxjs';

describe('OllaService', () => {
  let service: OllaService;
  let mockRepository: jasmine.SpyObj<IOllaRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('IOllaRepository', ['obtenerOllas']);
    
    TestBed.configureTestingModule({
      providers: [
        OllaService,
        { provide: IOllaRepository, useValue: mockRepository }
      ]
    });
    service = TestBed.inject(OllaService);
  });

  it('debería obtener ollas del repositorio', (done) => {
    const mockData = [{ id: 1, nombre: 'Olla Test' }];
    mockRepository.obtenerOllas.and.returnValue(of(mockData));

    service.obtenerOllas().subscribe(data => {
      expect(data).toEqual(mockData);
      done();
    });
  });
});
```

---

## 6. Debugging

### Console Logs

```typescript
// Con prefijo para identificar fácilmente
console.log('[OllaService] Cargando ollas...');
console.error('[OllaService] Error:', error);
```

### Debug Mode en Angular

```typescript
// En app.component.ts
import { enableDebugTools } from '@angular/platform-browser';

ngAfterViewInit() {
  enableDebugTools(this);
}
```

---

## 7. Performance

### OnPush Change Detection

```typescript
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class CardComponent {
  @Input() data: any;
}
```

### TrackBy en Loops

```typescript
trackByFn(index: number, item: OllaComunas) {
  return item.id;
}

<!-- En template -->
<div *ngFor="let olla of ollas; trackBy: trackByFn">
  {{ olla.nombre }}
</div>
```

---

## 8. Checklist para Nueva Feature

- [ ] Modelo de dominio creado
- [ ] Interfaz del repositorio creada
- [ ] Servicio de aplicación creado
- [ ] Adaptador HTTP creado
- [ ] Registrado en DI
- [ ] Componentes creados
- [ ] Rutas registradas
- [ ] Backend implementado
- [ ] Tests escritos
- [ ] Documentación actualizada

---

## 9. Comandos Útiles

```bash
# Frontend
pnpm run dev          # Desarrollo
pnpm run build        # Build
pnpm run lint         # Linting

# Backend
python -m uvicorn src.main:app --reload
pytest                # Tests

# Database
mysql -u root -p redcomunitaria < script.sql
```

---

## 10. Recursos

- **Angular Docs**: https://angular.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **FastAPI**: https://fastapi.tiangolo.com
- **RxJS**: https://rxjs.dev/

---

## Próximas Prioridades

1. **Backend HTTP Routes**: Implementar todos los endpoints
2. **Backend Database**: Conectar modelos SQLAlchemy
3. **Frontend Testing**: Agregar tests unitarios
4. **Error Handling**: Mejorar manejo de errores
5. **Loading States**: Agregar spinners/skeletons
6. **Validations**: Más validaciones en formularios
7. **Notifications**: Sistema de notificaciones
8. **Search**: Búsqueda en tiempo real

---

**Happy Coding!** 🚀
