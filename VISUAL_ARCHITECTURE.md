# Arquitectura Visual - RedComunitaria

## 📱 Flujo General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    NAVEGADOR DEL USUARIO                         │
│                   (http://localhost:4200)                        │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP/HTTPS
                              │ (Requests & Responses)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│          FRONTEND - Angular 19 (puerto 4200)                     │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Componentes Principales                                 │   │
│ │  ├─ LoginComponent (Página de inicio de sesión)         │   │
│ │  ├─ HomeComponent (Dashboard)                           │   │
│ │  ├─ OllasComunesComponent (Listado de ollas)           │   │
│ │  ├─ DonacionesComponent (Sistema de donaciones)        │   │
│ │  └─ NavbarComponent (Menú superior)                    │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Servicios (conectan con Backend)                        │   │
│ │  ├─ AutenticacionService (Login/Register)              │   │
│ │  ├─ OllaService (CRUD Ollas)                           │   │
│ │  └─ DonacionService (CRUD Donaciones)                  │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Almacenamiento Local                                    │   │
│ │  ├─ localStorage (Token JWT)                            │   │
│ │  └─ SessionStorage (Datos temporales)                   │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ API REST
                              │ (http://localhost:8000)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│       BACKEND - FastAPI Python (puerto 8000)                    │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Endpoints API                                           │   │
│ │  POST   /api/auth/login          → Autenticar usuario   │   │
│ │  POST   /api/auth/register       → Registrar usuario    │   │
│ │  GET    /api/ollas               → Listar ollas         │   │
│ │  GET    /api/ollas/{id}          → Detalles olla        │   │
│ │  POST   /api/ollas               → Crear olla           │   │
│ │  GET    /api/donaciones          → Listar donaciones    │   │
│ │  POST   /api/donaciones          → Crear donación       │   │
│ │  GET    /api/health              → Verificar servidor   │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Capa de Seguridad                                       │   │
│ │  ├─ JWT Authentication (Tokens)                         │   │
│ │  ├─ Password Hashing (bcrypt)                           │   │
│ │  └─ CORS Middleware                                     │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ SQL Queries
                              │ (MySQL Protocol)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│         BASE DE DATOS - MySQL (puerto 3306)                     │
├─────────────────────────────────────────────────────────────────┤
│ Database: redcomunitaria                                         │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │  Tablas Principales                                      │   │
│ │  ├─ usuarios                (Información de usuarios)    │   │
│ │  ├─ ollas_comunes           (Ollas registradas)         │   │
│ │  ├─ necesidades             (Necesidades por olla)      │   │
│ │  ├─ stocks_disponibles      (Inventario de recursos)    │   │
│ │  ├─ donaciones              (Registro de donaciones)     │   │
│ │  ├─ beneficiarios           (Personas que se benefician)│   │
│ │  └─ auditoría               (Historial de cambios)      │   │
│ └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estructura de Carpetas en Disco

```
v0-project/
│
├── 📂 src/
│   ├── app/
│   │   ├── domain/                    ← LÓGICA DE NEGOCIO
│   │   │   ├── models/
│   │   │   │   ├── usuario.model.ts
│   │   │   │   ├── olla.model.ts
│   │   │   │   └── donacion.model.ts
│   │   │   ├── repositories/          ← INTERFACES
│   │   │   │   ├── olla.repository.ts
│   │   │   │   ├── donacion.repository.ts
│   │   │   │   └── autenticacion.repository.ts
│   │   │   └── services/              ← CASOS DE USO
│   │   │       ├── autenticacion.service.ts
│   │   │       ├── olla.service.ts
│   │   │       └── donacion.service.ts
│   │   │
│   │   ├── presentation/              ← INTERFAZ DE USUARIO
│   │   │   ├── components/
│   │   │   │   └── layout/
│   │   │   │       └── navbar/
│   │   │   │           └── navbar.component.ts
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   │   └── login.component.ts
│   │   │   │   ├── home/
│   │   │   │   │   └── home.component.ts
│   │   │   │   ├── ollas-comunes/
│   │   │   │   │   └── ollas-comunes.component.ts
│   │   │   │   └── donaciones/
│   │   │   │       └── donaciones.component.ts
│   │   │   ├── adapters/              ← CONECTA CON BACKEND
│   │   │   │   ├── olla.http-adapter.ts
│   │   │   │   ├── donacion.http-adapter.ts
│   │   │   │   ├── autenticacion.http-adapter.ts
│   │   │   │   └── auth.interceptor.ts
│   │   │   └── guards/
│   │   │       └── auth.guard.ts
│   │   │
│   │   ├── infrastructure/            ← CONFIGURACIÓN
│   │   │   └── di-setup.ts
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   │
│   ├── environments/
│   │   └── environment.ts
│   │
│   ├── styles.css
│   └── main.ts
│
├── 📂 public/
│   └── logo.jpg
│
├── 📂 backend/
│   ├── 📂 venv/                       ← ENTORNO VIRTUAL (Se crea)
│   ├── 📂 src/
│   │   ├── main.py                    ← PUNTO DE ENTRADA
│   │   ├── config.py                  ← CONFIGURACIÓN
│   │   ├── database.py                ← CONEXIÓN BD
│   │   ├── adapters/
│   │   │   └── routes.py              ← ENDPOINTS API
│   │   └── security/
│   │       └── auth.py                ← AUTENTICACIÓN
│   │
│   ├── .env                           ← CREDENCIALES (LOCAL)
│   └── requirements.txt               ← DEPENDENCIAS PYTHON
│
├── 📂 scripts/
│   ├── init_db.sql                    ← CREAR TABLAS
│   └── seed_db.sql                    ← DATOS DE PRUEBA
│
├── 📄 angular.json                    ← CONFIG ANGULAR
├── 📄 tsconfig.json                   ← CONFIG TYPESCRIPT
├── 📄 tailwind.config.ts              ← CONFIG TAILWIND
├── 📄 postcss.config.js               ← CONFIG POSTCSS
├── 📄 package.json                    ← DEPENDENCIAS NODE
│
├── 📄 README.md                       ← INICIO AQUÍ
├── 📄 QUICK_START.md                  ← EMPEZAR RÁPIDO
├── 📄 BACKEND_SETUP_PASO_A_PASO.md    ← GUÍA BACKEND
├── 📄 BACKEND_QUICK_REFERENCE.md      ← REFERENCIA RÁPIDA
├── 📄 PROJECT_SUMMARY.md              ← RESUMEN COMPLETO
├── 📄 DEVELOPMENT.md                  ← DESARROLLO
├── 📄 FILE_STRUCTURE.md               ← ESTRUCTURA
└── 📄 CHANGELOG.md                    ← CAMBIOS

```

---

## 🔄 Flujo de Autenticación

```
1. Usuario ingresa credenciales
   │
   └─→ LoginComponent
       │
       └─→ AutenticacionService.login()
           │
           └─→ POST /api/auth/login
               │
               └─→ Backend valida credenciales
                   │
                   ├─ Si OK: Crea JWT Token
                   │          └─→ Retorna token + usuario
                   │
                   └─ Si ERROR: Status 401
                                └─→ Muestra error en frontend
   
   2. Frontend recibe Token JWT
      │
      └─→ LocalStorage guarda el token
          │
          └─→ Auth Interceptor lo agrega a TODOS los requests
              │
              └─→ Backend valida token en cada request
                  │
                  └─→ Si válido: Procesa la acción
                      Si inválido: Status 401 → Logout automático
```

---

## 📋 Ciclo CRUD - Ejemplo: Crear Olla

```
Frontend (Angular)
    │
    ├─ Usuario llena formulario
    │  (nombre, responsable, ubicación, etc)
    │
    ├─ Click botón "Registrar Olla"
    │
    ├─ OllaComponent.registrarOlla()
    │
    ├─ OllaService.createOlla(data)
    │
    ├─ OllaHttpAdapter.post("/api/ollas", data)
    │
    └─→ Backend (Python)
        │
        ├─ FastAPI recibe POST /api/ollas
        │
        ├─ Valida datos recibidos
        │
        ├─ Conecta a MySQL
        │
        ├─ INSERT INTO ollas_comunes (...)
        │
        ├─ Guarda en BD
        │
        └─→ Retorna {"mensaje": "Olla creada"}
            │
            └─→ Frontend recibe respuesta
                │
                ├─ Actualiza listado de ollas
                │
                ├─ Cierra formulario
                │
                └─ Muestra mensaje "¡Olla creada exitosamente!"
```

---

## 🔑 Variables de Entorno (.env)

```
┌─────────────────────────────────────┐
│         CONFIGURACIÓN BD            │
├─────────────────────────────────────┤
│ DB_HOST=localhost                   │
│ DB_PORT=3306                        │
│ DB_USER=root                        │
│ DB_PASSWORD=tu_contraseña           │
│ DB_NAME=redcomunitaria              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│       CONFIGURACIÓN JWT/AUTH        │
├─────────────────────────────────────┤
│ JWT_SECRET=llave_secreta_aqui       │
│ JWT_ALGORITHM=HS256                 │
│ JWT_EXPIRATION_HOURS=24             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        CONFIGURACIÓN API            │
├─────────────────────────────────────┤
│ API_PORT=8000                       │
│ API_HOST=0.0.0.0                    │
└─────────────────────────────────────┘
```

---

## 📡 Rutas API Disponibles

### Autenticación
```
POST   /api/auth/login              Login con email/password
POST   /api/auth/register           Registrar nuevo usuario
GET    /api/auth/me                 Obtener usuario actual
POST   /api/auth/logout             Cerrar sesión
```

### Ollas Comunes
```
GET    /api/ollas                   Listar todas las ollas
GET    /api/ollas/{id}              Ver detalles de una olla
POST   /api/ollas                   Crear nueva olla
PUT    /api/ollas/{id}              Actualizar olla
DELETE /api/ollas/{id}              Eliminar olla
```

### Donaciones
```
GET    /api/donaciones              Listar todas las donaciones
GET    /api/donaciones/{id}         Ver detalles de una donación
POST   /api/donaciones              Crear nueva donación
PUT    /api/donaciones/{id}         Actualizar donación
DELETE /api/donaciones/{id}         Eliminar donación
```

### Sistema
```
GET    /api/health                  Verificar servidor está vivo
GET    /api/stats                   Estadísticas generales
```

---

## 🔐 Tablas de Base de Datos

```
┌─────────────────────────────────────┐
│         TABLA: usuarios             │
├─────────────────────────────────────┤
│ id (PK)                             │
│ email (UNIQUE)                      │
│ nombre                              │
│ contraseña_hash (bcrypt)            │
│ rol (admin/donante/voluntario)      │
│ fecha_creacion (TIMESTAMP)          │
│ activo (BOOLEAN)                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      TABLA: ollas_comunes           │
├─────────────────────────────────────┤
│ id (PK)                             │
│ nombre                              │
│ responsable (FK → usuarios)         │
│ ubicacion                           │
│ beneficiarios (INT)                 │
│ estado (activa/pausada/cerrada)     │
│ fecha_creacion (TIMESTAMP)          │
│ necesidades_descripcion             │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         TABLA: donaciones           │
├─────────────────────────────────────┤
│ id (PK)                             │
│ donante (FK → usuarios)             │
│ recurso                             │
│ cantidad (DECIMAL)                  │
│ unidad (kg/l/paquetes)              │
│ olla_destino (FK → ollas_comunes)   │
│ estado (registrada/entregada)       │
│ fecha_donacion (TIMESTAMP)          │
│ notas (TEXT)                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      TABLA: necesidades             │
├─────────────────────────────────────┤
│ id (PK)                             │
│ olla_id (FK → ollas_comunes)        │
│ recurso                             │
│ cantidad_requerida                  │
│ cantidad_disponible                 │
│ prioridad (baja/media/alta)         │
│ fecha_creacion (TIMESTAMP)          │
└─────────────────────────────────────┘
```

---

## 🎯 Resumen de Ubicaciones Clave

| Qué busco | Dónde está |
|-----------|-----------|
| Frontend (Angular) | `/src/app/` |
| Componentes UI | `/src/app/presentation/pages/` |
| Lógica de negocio | `/src/app/domain/services/` |
| Servicios HTTP | `/src/app/presentation/adapters/` |
| Estilos CSS | `/src/styles.css` |
| Configuración Angular | `/angular.json` |
| Backend Python | `/backend/src/` |
| Rutas API | `/backend/src/adapters/routes.py` |
| Autenticación | `/backend/src/security/auth.py` |
| Conexión BD | `/backend/src/database.py` |
| Scripts SQL | `/scripts/` |
| Variables de entorno | `/backend/.env` |
