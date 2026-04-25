# Implementación RedComunitaria - Angular 19 + Arquitectura Hexagonal

## ✅ Versión de Angular Actualizada a 19

### Cambios de Versión
- **Angular**: 19.2.21 (compatible y sin conflictos)
- **Zone.js**: 0.15.0 (compatible con Angular 19)
- **TypeScript**: 5.7.3
- **Tailwind CSS**: 3.4.19
- **RxJS**: 7.8.2

### Configuración Completada
- ✅ `tsconfig.json` - Configurado para Angular 19
- ✅ `tsconfig.app.json` - TypeScript para build de aplicación
- ✅ `angular.json` - Configuración de Angular CLI
- ✅ `postcss.config.js` - Procesamiento de CSS
- ✅ `tailwind.config.ts` - Sistema de diseño con paleta personalizada

---

## 📁 Estructura del Proyecto

```
/src
├── app/
│   ├── app.component.ts              # Componente raíz
│   ├── app.config.ts                 # Configuración de la app
│   ├── app.routes.ts                 # Rutas principales
│   │
│   ├── domain/                       # CAPA DE DOMINIO (Lógica de Negocio)
│   │   ├── models/
│   │   │   ├── usuario.model.ts
│   │   │   ├── olla.model.ts
│   │   │   ├── donacion.model.ts
│   │   │   └── necesidad.model.ts
│   │   ├── repositories/             # PUERTOS (Interfaces)
│   │   │   ├── olla.repository.ts
│   │   │   ├── donacion.repository.ts
│   │   │   └── autenticacion.repository.ts
│   │   └── services/                 # CASOS DE USO
│   │       ├── autenticacion.service.ts
│   │       ├── olla.service.ts
│   │       └── donacion.service.ts
│   │
│   ├── presentation/                 # CAPA DE PRESENTACIÓN
│   │   ├── adapters/                 # ADAPTADORES (Implementaciones HTTP)
│   │   │   ├── olla.http-adapter.ts
│   │   │   ├── donacion.http-adapter.ts
│   │   │   ├── autenticacion.http-adapter.ts
│   │   │   ├── auth.interceptor.ts
│   │   │   └── auth.guard.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── navbar/
│   │   │           └── navbar.component.ts
│   │   └── pages/
│   │       ├── login/
│   │       │   └── login.component.ts
│   │       ├── home/
│   │       │   └── home.component.ts
│   │       ├── ollas-comunes/
│   │       │   └── ollas-comunes.component.ts
│   │       └── donaciones/
│   │           └── donaciones.component.ts
│   │
│   └── infrastructure/               # CAPA DE INFRAESTRUCTURA
│       └── di-setup.ts               # Inyección de Dependencias
│
├── environments/
│   └── environment.ts                # Variables de entorno
│
├── main.ts                           # Entry point
├── index.html                        # HTML principal
└── styles.css                        # Estilos globales

/scripts
├── init_db.sql                       # Inicialización de BD
└── seed_db.sql                       # Datos de prueba

/backend
├── requirements.txt                  # Dependencias Python
└── .env.example                      # Variables de entorno

📄 Archivos de Configuración
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
└── .gitignore
```

---

## 🎯 Componentes Implementados

### 1. **Login Component** (`login.component.ts`)
- Formulario reactivo con validación
- Autenticación con JWT
- Gestión de errores
- Paleta de colores personalizada

### 2. **Home Component** (`home.component.ts`)
- Estadísticas del sistema (150+ ollas, 5000+ familias, etc.)
- Descripción de funcionalidades
- Botones de navegación

### 3. **Ollas Comunes Component** (`ollas-comunes.component.ts`)
- Listado de ollas registradas
- Búsqueda y filtros por prioridad
- Modal para ver detalles
- Formulario para registrar nueva olla
- CRUD completo (crear, leer, actualizar, eliminar)

### 4. **Donaciones Component** (`donaciones.component.ts`)
- Listado de donaciones
- Formulario para crear donación
- Campos: nombre, email, teléfono, tipo, cantidad, recurso, olla destino
- Estado de donación integrado
- Tabla de últimas donaciones

### 5. **Navbar Component** (`navbar.component.ts`)
- Navegación responsiva
- Logo personalizado
- Links dinámicos según autenticación
- Botón de cerrar sesión

---

## 🔐 Autenticación y Seguridad

### Auth Guard
```typescript
// Protege rutas que requieren autenticación
canActivate(['inicio', 'ollas-comunes', 'donar'])
```

### Auth Interceptor
```typescript
// Agrega token JWT automáticamente a todas las peticiones HTTP
Authorization: Bearer {token}
```

### Almacenamiento de Token
```typescript
// Se guarda en localStorage
localStorage.setItem('token', jwt_token);
```

---

## 🎨 Diseño Visual (según Figma)

### Paleta de Colores
- **Primary**: #0891b2 (Cyan brillante)
- **Secondary**: #1e3a8a (Navy azul)
- **Success**: #10b981 (Verde)
- **Warning**: #f59e0b (Ámbar)
- **Danger**: #ef4444 (Rojo)
- **Background**: #ffffff
- **Foreground**: #1f2937

### Tipografía
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Font Size Base**: 16px

---

## 📡 Arquitectura Hexagonal en Angular

### Capa de Dominio (Domain Layer)
Contiene la **lógica pura de negocio** sin dependencias externas:
- Models (entidades)
- Repositories (interfaces)
- Services (casos de uso)

### Capa de Presentación (Presentation Layer)
Implementa los puertos definidos en el dominio:
- Components (UI)
- Adapters HTTP (implementan repositories)
- Guards (protección de rutas)
- Interceptors (middleware HTTP)

### Capa de Infraestructura (Infrastructure Layer)
Configuración técnica:
- Inyección de dependencias
- Variables de entorno
- Configuración de HTTP

---

## 🚀 Iniciar el Proyecto

### Instalación
```bash
cd /vercel/share/v0-project
pnpm install
```

### Desarrollo
```bash
pnpm run dev
# Acceder en http://localhost:4200
```

### Build Producción
```bash
pnpm run build
# Output en /dist/redcomunitaria
```

---

## 📋 CRUDs Implementados

### 1. **Ollas Comunes**
- `GET /api/ollas` - Listar
- `GET /api/ollas/{id}` - Obtener detalle
- `POST /api/ollas` - Crear
- `PUT /api/ollas/{id}` - Actualizar
- `DELETE /api/ollas/{id}` - Eliminar

### 2. **Donaciones**
- `GET /api/donaciones` - Listar
- `POST /api/donaciones` - Crear
- `PUT /api/donaciones/{id}` - Actualizar
- `DELETE /api/donaciones/{id}` - Eliminar

### 3. **Autenticación**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout

---

## 🗄️ Base de Datos MySQL

### Tablas Creadas
```sql
-- usuarios
-- ollas_comunes
-- necesidades
-- stocks_disponibles
-- donaciones
-- beneficiarios
-- donacion_detalles
```

**Scripts disponibles**:
- `scripts/init_db.sql` - Crear tablas
- `scripts/seed_db.sql` - Datos de prueba

---

## 📚 Documentación Completa

- `README.md` - Visión general
- `QUICK_START.md` - Guía rápida (5 minutos)
- `PROJECT_SUMMARY.md` - Resumen detallado
- `BACKEND_GUIDE.md` - Implementar backend Python
- `DEVELOPMENT.md` - Agregar nuevas features
- `FILE_STRUCTURE.md` - Estructura de carpetas
- `ANGULAR19_IMPLEMENTATION.md` - Este archivo

---

## ✅ Estado del Proyecto

| Componente | Estado | Detalles |
|-----------|--------|---------|
| Angular 19 | ✅ | Instalado y configurado |
| Tailwind CSS | ✅ | Configurado con paleta personalizada |
| Autenticación | ✅ | JWT con Guard e Interceptor |
| Login | ✅ | Formulario reactivo completo |
| Home | ✅ | Estadísticas y navegación |
| Ollas Comunes | ✅ | CRUD con modal y formulario |
| Donaciones | ✅ | CRUD con formulario |
| Navbar | ✅ | Responsivo y funcional |
| Servicios | ✅ | Domain Services implementados |
| Adaptadores | ✅ | HTTP adapters listos |
| Base de Datos | ✅ | Scripts SQL creados |
| Documentación | ✅ | Completa y detallada |

---

## 🔗 Próximos Pasos

1. **Backend (Python)**
   - Crear proyecto FastAPI
   - Implementar modelos SQLAlchemy
   - Crear endpoints según Swagger

2. **Conectar Frontend-Backend**
   - Actualizar `environment.ts` con URL del backend
   - Probar endpoints con Postman

3. **Mejoras Opcionales**
   - Tests unitarios
   - E2E tests
   - Paginación en listados
   - Exportar datos a PDF

---

**Creado con ❤️ por RedComunitaria**
