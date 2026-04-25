# RedComunitaria - Sistema de Distribución Equitativa de Recursos

Plataforma digital que conecta, organiza y transparenta la gestión de recursos para ollas comunes en el Perú.

## 📋 Descripción

RedComunitaria es un sistema integral diseñado para:
- Registrar y gestionar ollas comunes
- Facilitar donaciones transparentes
- Distribuir equitativamente los recursos
- Mantener un seguimiento completo (trazabilidad)
- Conectar donantes con beneficiarios

## 🏗️ Arquitectura

El proyecto implementa **Arquitectura Hexagonal** (Ports & Adapters) en ambas capas:

### Frontend (Angular 19)
```
src/app/
├── domain/                 # Lógica de negocio pura
│   ├── models/            # Interfaces y tipos
│   ├── repositories/      # Puertos (interfaces)
│   └── services/          # Casos de uso
├── presentation/          # Capa de presentación
│   ├── components/        # Componentes Angular
│   ├── pages/            # Páginas de la aplicación
│   ├── adapters/         # Adaptadores HTTP
│   └── guards/           # Guards de protección
└── infrastructure/        # Configuración
```

### Backend (Python + FastAPI)
```
backend/
├── src/
│   ├── domain/           # Lógica de negocio
│   ├── application/      # Casos de uso
│   ├── adapters/         # Implementaciones HTTP y BD
│   └── infrastructure/   # Configuración
├── scripts/              # Migraciones SQL
└── requirements.txt      # Dependencias
```

## 🛠️ Tecnologías

### Frontend
- **Framework**: Angular 19
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router

### Backend
- **Framework**: FastAPI
- **BD**: MySQL
- **Autenticación**: JWT
- **ORM**: SQLAlchemy (para migraciones)

## 📦 Instalación

### Requisitos Previos
- Node.js 18+
- Python 3.9+
- MySQL 8.0+

### Frontend Setup

```bash
# Instalar dependencias
npm install

# Desarrollar
ng serve
```

El frontend estará disponible en `http://localhost:4200`

### Backend Setup

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear base de datos
mysql -u root -p < scripts/init_db.sql
mysql -u root -p redcomunitaria < scripts/seed_db.sql

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar servidor
uvicorn src.main:app --reload
```

El backend estará disponible en `http://localhost:8000`

## 🔐 Autenticación

### Login
```
Email: donante1@email.com
Contraseña: 123456
```

La autenticación usa JWT tokens almacenados en localStorage y enviados en header `Authorization: Bearer <token>`

## 📊 Base de Datos

### Tablas Principales

1. **usuarios** - Usuarios del sistema (admin, donante, voluntario)
2. **ollas_comunes** - Registro de ollas comunes con estado y prioridad
3. **necesidades** - Necesidades específicas de cada olla
4. **stocks_disponibles** - Inventario de recursos
5. **donaciones** - Registro de donaciones con trazabilidad
6. **beneficiarios** - Familias beneficiadas
7. **distribucion_log** - Historial de distribuciones

## 🎨 Paleta de Colores

```
Primario:    #0891b2 (Cyan)
Secundario:  #1e3a8a (Navy)
Éxito:       #10b981 (Green)
Advertencia: #f59e0b (Amber)
Peligro:     #ef4444 (Red)
```

## 📄 Endpoints API

### Autenticación
```
POST /api/auth/login
POST /api/autenticacion/registrar
GET  /api/autenticacion/usuario
POST /api/autenticacion/logout
```

### Ollas Comunes
```
GET    /api/ollas-comunes
GET    /api/ollas-comunes/{id}
POST   /api/ollas-comunes
PUT    /api/ollas-comunes/{id}
DELETE /api/ollas-comunes/{id}
GET    /api/ollas-comunes/buscar?termino=...
```

### Donaciones
```
GET    /api/donaciones
GET    /api/donaciones/{id}
POST   /api/donaciones
PUT    /api/donaciones/{id}
DELETE /api/donaciones/{id}
```

## 🚀 Funcionalidades Principales

### Página de Inicio
- Hero con estadísticas (150+ ollas, 5000+ familias, etc.)
- Botones de navegación ("Ver Ollas Comunes", "Donar Ahora")
- Descripción de cómo funciona la plataforma
- Llamado a la acción

### Ollas Comunes
- Listado con búsqueda y filtros
- Cards con información de cada olla
- Modal con detalles completos
- Formulario para registrar nuevas ollas
- Estados: VALIDADA / PENDIENTE
- Prioridades: ALTA / MEDIA / BAJA

### Donaciones
- Formulario de donación
- Listado de últimas donaciones
- Tabla con historial completo
- Estados: ENTREGADA / PENDIENTE / EN_TRÁNSITO
- Trazabilidad completa

### Autenticación
- Login con email y contraseña
- JWT tokens
- Protección de rutas
- Logout

## 📝 Variables de Entorno

### Frontend (.env)
```
NG_APP_API_URL=http://localhost:8000/api
```

### Backend (.env)
```
DATABASE_URL=mysql://usuario:contraseña@localhost/redcomunitaria
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🧪 Testing

### Frontend
```bash
pnpm run test
```

### Backend
```bash
pytest
```

## 📚 Documentación Completa

Ver `/docs` para documentación detallada de:
- Casos de uso
- Flujos de datos
- Modelos de dominio
- Guía de contribución

## 👥 Roles y Permisos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| Admin | Administrador del sistema | Todo |
| Donante | Usuarios que realizan donaciones | Ver ollas, donar, ver historial |
| Voluntario | Personal de las ollas | Gestionar stock, registrar distribuciones |

## 📞 Soporte

Para reportar bugs o sugerencias:
- Email: support@redcomunitaria.pe
- Issues: GitHub Issues

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## ✨ Contribuidores

- Equipo RedComunitaria
- Voluntarios de la comunidad

---

**Solidaridad que conecta** ♥
