# Estructura de Archivos - RedComunitaria

## Vista Completa del Proyecto

```
redcomunitaria/
│
├── 📁 src/                                    # Código del Frontend (Angular)
│   ├── 📁 app/
│   │   ├── 📁 domain/                       # Capa de Dominio (Negocio Puro)
│   │   │   ├── 📁 models/
│   │   │   │   ├── usuario.model.ts         # Interfaz Usuario
│   │   │   │   ├── olla.model.ts            # Interfaz OllaComunas
│   │   │   │   └── donacion.model.ts        # Interfaz Donación
│   │   │   │
│   │   │   ├── 📁 repositories/             # Puertos (Interfaces)
│   │   │   │   ├── autenticacion.repository.ts
│   │   │   │   ├── olla.repository.ts
│   │   │   │   └── donacion.repository.ts
│   │   │   │
│   │   │   └── 📁 services/                 # Casos de Uso
│   │   │       ├── autenticacion.service.ts # Autenticación
│   │   │       ├── olla.service.ts          # Gestión de Ollas
│   │   │       └── donacion.service.ts      # Gestión de Donaciones
│   │   │
│   │   ├── 📁 presentation/                 # Capa de Presentación (Angular)
│   │   │   ├── 📁 adapters/                 # Adaptadores HTTP
│   │   │   │   ├── autenticacion.http-adapter.ts
│   │   │   │   ├── olla.http-adapter.ts
│   │   │   │   ├── donacion.http-adapter.ts
│   │   │   │   └── auth.interceptor.ts      # Interceptor JWT
│   │   │   │
│   │   │   ├── 📁 guards/                   # Guards de Rutas
│   │   │   │   └── auth.guard.ts            # Protección autenticación
│   │   │   │
│   │   │   ├── 📁 components/               # Componentes Compartidos
│   │   │   │   └── 📁 layout/
│   │   │   │       ├── 📁 navbar/
│   │   │   │       │   └── navbar.component.ts
│   │   │   │       └── 📁 footer/
│   │   │   │           └── footer.component.ts (futuro)
│   │   │   │
│   │   │   └── 📁 pages/                    # Páginas de la Aplicación
│   │   │       ├── 📁 login/
│   │   │       │   └── login.component.ts   # Login
│   │   │       ├── 📁 home/
│   │   │       │   └── home.component.ts    # Página de inicio
│   │   │       ├── 📁 ollas-comunes/
│   │   │       │   └── ollas-comunes.component.ts  # CRUD Ollas
│   │   │       └── 📁 donaciones/
│   │   │           └── donaciones.component.ts     # CRUD Donaciones
│   │   │
│   │   ├── 📁 infrastructure/               # Configuración
│   │   │   ├── config.ts                    # Configuración global
│   │   │   └── di-setup.ts                  # Inyección de dependencias
│   │   │
│   │   ├── app.component.ts                 # Componente raíz
│   │   ├── app.config.ts                    # Configuración de la app
│   │   └── app.routes.ts                    # Definición de rutas
│   │
│   ├── 📁 environments/
│   │   └── environment.ts                   # Configuración de entorno
│   │
│   ├── 📁 styles/
│   │   └── styles.css                       # Estilos globales
│   │
│   ├── index.html                           # HTML principal
│   └── main.ts                              # Entry point
│
├── 📁 backend/                              # Código del Backend (Python/FastAPI)
│   ├── 📁 src/
│   │   ├── 📁 domain/                      # Lógica de Negocio Pura
│   │   │   ├── 📁 entities/
│   │   │   │   ├── usuario.py
│   │   │   │   ├── olla.py
│   │   │   │   └── donacion.py
│   │   │   │
│   │   │   ├── 📁 repositories/            # Interfaces (Puertos)
│   │   │   │   ├── olla_repository.py
│   │   │   │   ├── donacion_repository.py
│   │   │   │   └── usuario_repository.py
│   │   │   │
│   │   │   └── 📁 services/                # Casos de Uso
│   │   │       ├── olla_service.py
│   │   │       ├── donacion_service.py
│   │   │       └── autenticacion_service.py
│   │   │
│   │   ├── 📁 application/                 # Capa de Aplicación
│   │   │   ├── 📁 dtos/
│   │   │   │   ├── olla_dto.py
│   │   │   │   ├── donacion_dto.py
│   │   │   │   └── usuario_dto.py
│   │   │   │
│   │   │   └── 📁 commands/
│   │   │       ├── crear_olla_command.py
│   │   │       ├── crear_donacion_command.py
│   │   │       └── registrar_usuario_command.py
│   │   │
│   │   ├── 📁 adapters/                   # Implementaciones Concretas
│   │   │   ├── 📁 database/
│   │   │   │   ├── models.py              # Modelos SQLAlchemy
│   │   │   │   ├── database.py            # Conexión BD
│   │   │   │   ├── mysql_olla_repository.py
│   │   │   │   ├── mysql_donacion_repository.py
│   │   │   │   └── mysql_usuario_repository.py
│   │   │   │
│   │   │   ├── 📁 http/
│   │   │   │   ├── 📁 routes/
│   │   │   │   │   ├── olla_routes.py
│   │   │   │   │   ├── donacion_routes.py
│   │   │   │   │   ├── usuario_routes.py
│   │   │   │   │   └── autenticacion_routes.py
│   │   │   │   │
│   │   │   │   └── 📁 middleware/
│   │   │   │       └── auth_middleware.py
│   │   │   │
│   │   │   └── 📁 security/
│   │   │       ├── jwt_handler.py
│   │   │       └── password_hasher.py
│   │   │
│   │   ├── 📁 infrastructure/              # Configuración
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── dependency_injection.py
│   │   │
│   │   └── main.py                         # Entry point FastAPI
│   │
│   ├── 📁 scripts/                         # Migraciones SQL
│   │   ├── init_db.sql                     # Crear tablas
│   │   └── seed_db.sql                     # Datos iniciales
│   │
│   ├── requirements.txt                    # Dependencias Python
│   ├── .env.example                        # Variables de entorno
│   └── .env                                # Variables locales (no commit)
│
├── 📁 scripts/                             # Scripts SQL (raíz proyecto)
│   ├── init_db.sql                         # Crear base de datos
│   └── seed_db.sql                         # Cargar datos de prueba
│
├── 📁 public/                              # Archivos estáticos
│   ├── favicon.ico                         # Icono
│   ├── logo.jpg                            # Logo de RedComunitaria
│   └── 📁 assets/                          # Imágenes y assets
│
├── 📁 node_modules/                        # Dependencias Node (generado)
├── 📁 dist/                                # Build compilado (generado)
├── 📁 .angular/                            # Cache Angular (generado)
│
├── Archivos de Configuración
│   ├── package.json                        # Configuración npm/pnpm
│   ├── pnpm-lock.yaml                      # Lock file pnpm
│   ├── tsconfig.json                       # Configuración TypeScript
│   ├── angular.json                        # Configuración Angular CLI
│   ├── tailwind.config.ts                  # Configuración Tailwind CSS
│   ├── postcss.config.mjs                  # Configuración PostCSS
│   └── .gitignore                          # Git ignore
│
├── Documentación
│   ├── README.md                           # Documentación principal
│   ├── QUICK_START.md                      # Guía rápida (5 minutos)
│   ├── PROJECT_SUMMARY.md                  # Resumen del proyecto
│   ├── BACKEND_GUIDE.md                    # Guía implementación backend
│   ├── DEVELOPMENT.md                      # Guía de desarrollo
│   ├── FILE_STRUCTURE.md                   # Este archivo
│   └── /v0_plans/
│       └── realistic-path.md               # Plan arquitectura
│
└── .env.example                            # Ejemplo variables entorno
```

---

## Descripción de Carpetas Principales

### `/src`
Código completo del frontend Angular con arquitectura hexagonal.

- **domain/**: Lógica de negocio independiente de frameworks
- **presentation/**: Componentes, páginas, adaptadores HTTP
- **infrastructure/**: Configuración e inyección de dependencias

### `/backend`
Código del backend en Python con FastAPI.

- **src/domain/**: Lógica de negocio pura
- **src/adapters/**: Implementaciones HTTP y base de datos
- **scripts/**: Migraciones SQL

### `/public`
Archivos estáticos (imágenes, iconos, etc.)

### `/scripts`
Scripts SQL para inicializar y cargar datos en la BD

---

## Archivos de Configuración

| Archivo | Propósito |
|---------|----------|
| `package.json` | Dependencias npm/pnpm, scripts |
| `tsconfig.json` | Configuración TypeScript |
| `angular.json` | Configuración Angular CLI |
| `tailwind.config.ts` | Configuración de estilos |
| `.gitignore` | Archivos a ignorar en git |

---

## Archivos Generados (No Commitear)

```
node_modules/       # Dependencias Node
dist/              # Build compilado
.angular/          # Cache de Angular
.env               # Variables de entorno locales
venv/              # Entorno virtual Python (backend)
```

---

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                     Usuario                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Página Angular (Component)                       │
│         /pages/{login,home,ollas,donar}                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Servicio de Dominio (Service)                       │
│    {Autenticacion, Olla, Donacion}Service                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Repositorio Interface (IXxxRepository)                │
│            /domain/repositories/                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      HTTP Adapter (XxxHttpAdapter)                            │
│       /presentation/adapters/                                 │
│              ↓                                                 │
│        HTTP Request                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴──────────────────┐
        │                                   │
        ▼                                   ▼
┌────────────────────┐          ┌────────────────────┐
│   FastAPI Backend  │          │  MySQL Database    │
│   /api/xxx         │          │                    │
│                    │          │                    │
│  ├─ routes/        │          │  Tables:           │
│  ├─ services/      │◄────────►│  ├─ usuarios      │
│  ├─ domain/        │          │  ├─ ollas_comunes │
│  └─ adapters/      │          │  ├─ donaciones    │
│                    │          │  └─ ...           │
└────────────────────┘          └────────────────────┘
```

---

## Cómo Navegar el Código

### Para Entender la Autenticación
1. Empezar en: `src/app/presentation/pages/login/login.component.ts`
2. Ver el servicio: `src/app/domain/services/autenticacion.service.ts`
3. Ver el adaptador: `src/app/presentation/adapters/autenticacion.http-adapter.ts`
4. Backend: `backend/src/adapters/http/routes/autenticacion_routes.py`

### Para Entender Ollas Comunes
1. Modelo: `src/app/domain/models/olla.model.ts`
2. Repositorio: `src/app/domain/repositories/olla.repository.ts`
3. Servicio: `src/app/domain/services/olla.service.ts`
4. Componente: `src/app/presentation/pages/ollas-comunes/ollas-comunes.component.ts`

### Para Agregar Nuevos Campos
1. Actualizar modelo en `domain/models/`
2. Actualizar DTOs en backend `application/dtos/`
3. Actualizar formulario en componente
4. Actualizar tabla en base de datos

---

## Convenciones de Nomenclatura

| Tipo | Convención | Ejemplo |
|------|-----------|---------|
| Interfaces | I+Nombre | `IAutenticacionRepository` |
| Clases | Nombre+Tipo | `AutenticacionService` |
| Adaptadores | Nombre+Adapter | `AutenticacionHttpAdapter` |
| Componentes | Nombre+Component | `LoginComponent` |
| Servicios | Nombre+Service | `AutenticacionService` |
| Guards | Nombre+Guard | `AuthGuard` |
| Models/DTOs | Nombre+Model/DTO | `Usuario.model.ts` |

---

## Estadísticas del Proyecto

```
Frontend:
  - 4 páginas principales
  - 1 componente navbar
  - 3 servicios de dominio
  - 3 adaptadores HTTP
  - 3 modelos de datos
  - 3 interfaces de repositorio

Backend:
  - 6 entidades de dominio
  - 7 tablas en BD
  - 4 rutas HTTP principales
  - 3 repositorios

Documentación:
  - 6 archivos MD
  - 1 plan de arquitectura
  - 150+ líneas README
  - 450+ líneas BACKEND_GUIDE
```

---

## Tips de Navegación

1. **Buscar tipo**: `Ctrl+F` en el proyecto y busca `interface`, `class`, `@Component`
2. **Ir a archivo**: `Ctrl+P` en VS Code para abrir rápidamente
3. **Buscar referencias**: `Shift+F12` para ver dónde se usa algo
4. **Definición**: `Ctrl+Click` para ir a la definición

---

## Checklist de Archivos Necesarios

- [ ] `/src/main.ts` - Entry point ✅
- [ ] `/src/index.html` - HTML principal ✅
- [ ] `/src/styles.css` - Estilos globales ✅
- [ ] `/src/app/app.component.ts` - Componente raíz ✅
- [ ] `/src/app/app.routes.ts` - Rutas ✅
- [ ] `/src/app/app.config.ts` - Configuración ✅
- [ ] `/backend/requirements.txt` - Dependencias Python ✅
- [ ] `/scripts/init_db.sql` - Crear BD ✅
- [ ] `/scripts/seed_db.sql` - Datos iniciales ✅
- [ ] `package.json` - Dependencias npm ✅
- [ ] `tsconfig.json` - Config TypeScript ✅
- [ ] `angular.json` - Config Angular ✅
- [ ] `tailwind.config.ts` - Config Tailwind ✅

---

**Última actualización**: 2026-04-24
**Versión**: 1.0.0
**Status**: ✅ Estructura Completa
