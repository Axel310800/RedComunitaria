# Quick Start - RedComunitaria

## Inicio Rápido en 5 Minutos

### Requisitos Previos
- Node.js 18+
- Python 3.9+
- MySQL 8.0+
- Git

---

## Frontend (Angular)

### 1. Instalar y Ejecutar

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm run dev
```

**URL**: `http://localhost:4200`

### 2. Login

```
Email: donante1@email.com
Contraseña: password123
```

---

## Backend (FastAPI)

### 1. Preparar Base de Datos

```bash
# Crear tablas
mysql -u root -p < scripts/init_db.sql

# Cargar datos de prueba
mysql -u root -p redcomunitaria < scripts/seed_db.sql
```

### 2. Configurar Python

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar variables de entorno
cp .env.example .env

# Editar .env si es necesario (usuario/contraseña de MySQL)
```

### 3. Ejecutar Backend

```bash
python -m uvicorn src.main:app --reload
```

**URL**: `http://localhost:8000`
**Docs**: `http://localhost:8000/docs`

---

## Estructura de Carpetas

```
proyecto/
├── src/                          # Código frontend (Angular)
│   ├── app/                      # Componentes y servicios
│   ├── styles/                   # Estilos CSS
│   ├── environments/             # Configuración de entorno
│   └── index.html
├── backend/                      # Código backend (FastAPI)
│   ├── src/                      # Código fuente Python
│   ├── scripts/                  # Scripts SQL
│   ├── requirements.txt
│   └── .env.example
├── scripts/                      # Scripts SQL (raíz del proyecto)
├── README.md                     # Documentación
├── PROJECT_SUMMARY.md            # Resumen del proyecto
└── BACKEND_GUIDE.md             # Guía detallada del backend
```

---

## Rutas Principales

### Frontend
- `/login` - Página de login
- `/inicio` - Home
- `/ollas-comunes` - Gestión de ollas
- `/donar` - Donaciones

### Backend API
- `GET /api/ollas-comunes` - Listar ollas
- `POST /api/ollas-comunes` - Crear olla
- `GET /api/donaciones` - Listar donaciones
- `POST /api/donaciones` - Crear donación
- `POST /api/autenticacion/login` - Login

---

## Usuarios de Prueba

| Email | Rol | Contraseña |
|-------|-----|-----------|
| donante1@email.com | donante | password123 |
| admin@redcomunitaria.pe | admin | password123 |
| voluntario1@email.com | voluntario | password123 |

---

## Troubleshooting

### Frontend no abre en localhost:4200

```bash
# Limpiar caché
pnpm clean
pnpm install
pnpm run dev
```

### Backend error de conexión MySQL

```bash
# Verificar que MySQL está corriendo
mysql -u root -p -e "SELECT 1"

# Crear base de datos si no existe
mysql -u root -p < scripts/init_db.sql
```

### CORS Error

- Asegúrate que backend está en `http://localhost:8000`
- Asegúrate que frontend está en `http://localhost:4200`

### Puerto en uso

```bash
# Frontend (cambiar puerto)
pnpm run dev -- --port 4201

# Backend (cambiar puerto)
python -m uvicorn src.main:app --reload --port 8001
```

---

## Próximos Pasos

1. **Explorar el Frontend**
   - Ir a `/login`
   - Logearse con credenciales de prueba
   - Navegar a "Ollas Comunes" y "Donar"

2. **Explorar el Backend**
   - Ir a `http://localhost:8000/docs`
   - Ver todos los endpoints disponibles
   - Probar los endpoints interactivamente

3. **Leer la Documentación**
   - `README.md` - Visión general
   - `PROJECT_SUMMARY.md` - Qué está implementado
   - `BACKEND_GUIDE.md` - Cómo implementar más en backend

4. **Desarrollar Nuevas Funciones**
   - Agregar más campos en formularios
   - Crear nuevos endpoints
   - Mejorar la UI/UX
   - Agregar validaciones

---

## Comandos Útiles

### Frontend
```bash
pnpm run dev          # Desarrollo
pnpm run build        # Build para producción
pnpm run lint         # Linting
pnpm install          # Instalar dependencias
```

### Backend
```bash
python -m uvicorn src.main:app --reload   # Ejecutar
pip install -r requirements.txt             # Instalar deps
pytest                                      # Tests
```

### Base de Datos
```bash
mysql -u root -p redcomunitaria            # Conectar
mysql -u root -p < scripts/init_db.sql     # Crear tablas
mysql -u root -p redcomunitaria < scripts/seed_db.sql  # Cargar datos
```

---

## Arquitectura en 30 Segundos

**Frontend (Angular)**
```
Componentes Angular → Servicios → HTTP Adapters → API Backend
```

**Backend (FastAPI)**
```
HTTP Routes → Services → Domain Logic → MySQL Adapters → Database
```

**Flujo de Datos**
```
User → Login → JWT Token → API Calls → Data Display
```

---

## Contacto y Soporte

Para preguntas sobre:
- **Arquitectura**: Ver `PROJECT_SUMMARY.md`
- **Backend**: Ver `BACKEND_GUIDE.md`
- **General**: Ver `README.md`

---

## Checklist de Verificación

- [ ] Node.js instalado (`node --version`)
- [ ] Python instalado (`python --version`)
- [ ] MySQL instalado y corriendo
- [ ] Dependencias frontend instaladas (`pnpm install`)
- [ ] Dependencias backend instaladas (`pip install -r requirements.txt`)
- [ ] Base de datos creada (`init_db.sql`)
- [ ] Datos de prueba cargados (`seed_db.sql`)
- [ ] Frontend en `http://localhost:4200`
- [ ] Backend en `http://localhost:8000`
- [ ] Puedes logearte con `donante1@email.com`

---

**¡Listo para empezar!** 🚀

Accede a `http://localhost:4200` en tu navegador.
