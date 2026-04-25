# Guía Paso a Paso: Ejecutar el Backend - RedComunitaria

## 📋 Resumen Rápido

El backend se ejecuta en **Python** usando **FastAPI**. Necesitas:
1. Instalar Python 3.10+
2. Instalar MySQL
3. Crear base de datos
4. Ejecutar el servidor FastAPI

---

## 🔧 PASO 1: Instalar Python

### En Windows:
1. Descarga Python desde https://www.python.org/downloads/
2. **MUY IMPORTANTE**: Al instalar, marca la opción ✅ "Add Python to PATH"
3. Haz clic en "Install Now"
4. Espera a que termine

### Verificar instalación:
Abre **CMD** (Command Prompt) o **PowerShell** y escribe:
```bash
python --version
```
Deberías ver: `Python 3.10.x` o superior

---

## 🗄️ PASO 2: Instalar MySQL

### Opción A: MySQL Community Server (Recomendado)

1. Descarga desde: https://dev.mysql.com/downloads/mysql/
2. Descarga **MySQL Community Server** (versión 8.0 o superior)
3. Ejecuta el instalador `.msi`
4. Siguiente, siguiente...
5. En "Type and Networking" deja todo por defecto
6. En "Authentication Method" selecciona "Use Legacy Authentication Method"
7. **Configura la contraseña root**: Recuerda esta contraseña, la usarás después
   - Usuario: `root`
   - Contraseña: `tu_contraseña_aqui` (ejemplo: `admin123`)
8. Termina la instalación

### Opción B: MySQL + UI (MySQL Workbench)

Si instalaste MySQL Community Server, también instala:
- Descarga MySQL Workbench desde: https://dev.mysql.com/downloads/workbench/

**Esto te da una interfaz gráfica para manejar la BD**

---

## ✅ PASO 3: Verificar que MySQL funciona

### En Windows:

1. Abre **Services** (Servicios):
   - Presiona `Win + R`
   - Escribe `services.msc`
   - Presiona Enter

2. Busca **MySQL80** (o la versión que instalaste)
3. Verifica que esté en estado "Running" (verde)
4. Si no está corriendo, haz click derecho → "Start"

### Alternativa - Por CMD:

Abre **CMD** como Administrador y prueba:
```bash
mysql --version
```

Deberías ver: `mysql  Ver 8.0.x...`

---

## 📂 PASO 4: Preparar la Carpeta del Backend

1. Abre **Visual Studio Code**
2. Abre la carpeta del proyecto `/vercel/share/v0-project`
3. En VS Code, abre una terminal nueva:
   - Presiona `Ctrl + Ñ` (o `Ctrl + ~`)
   - O ve a Terminal → New Terminal

4. Verifica que estés en la carpeta correcta. Deberías ver en la terminal:
```
PS C:\...\v0-project>
```

5. Crea la carpeta `backend` (si no existe):
```bash
mkdir backend
```

---

## 🐍 PASO 5: Crear Entorno Virtual de Python

El entorno virtual es como una "carpeta aislada" para tu proyecto Python.

En la terminal de VS Code, escribe:

```bash
cd backend
python -m venv venv
```

**Esto creará una carpeta `venv` con todas las dependencias de Python aisladas**

---

## 🔌 PASO 6: Activar el Entorno Virtual

### En Windows (PowerShell):

```bash
venv\Scripts\Activate.ps1
```

Si te da error de permisos, ejecuta PowerShell como administrador.

### En Windows (CMD):

```bash
venv\Scripts\activate.bat
```

**Cuando lo actives, deberías ver `(venv)` al inicio de tu terminal:**

```
(venv) PS C:\...\v0-project\backend>
```

---

## 📦 PASO 7: Instalar Dependencias de Python

Con el entorno virtual activado, escribe:

```bash
pip install fastapi uvicorn mysql-connector-python sqlalchemy pyjwt python-dotenv bcrypt
```

**Esto instalará:**
- `fastapi` - Framework web
- `uvicorn` - Servidor
- `mysql-connector-python` - Conector MySQL
- `sqlalchemy` - ORM para BD
- `pyjwt` - Para JWT tokens
- `python-dotenv` - Para variables de entorno
- `bcrypt` - Para encriptar contraseñas

Espera a que termine (puede tardar 1-2 minutos)

---

## 📝 PASO 8: Crear Archivo `.env`

Este archivo contiene las credenciales de la BD. 

1. Ve a la carpeta `backend` en VS Code
2. Crea un archivo nuevo: `backend/.env`
3. Copia esto y actualiza con tus credenciales:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin123
DB_NAME=redcomunitaria

# JWT
JWT_SECRET=tu_llave_secreta_super_segura_aqui_2024
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# API
API_PORT=8000
API_HOST=0.0.0.0
```

**Importante:** Reemplaza `admin123` con la contraseña que configuraste en MySQL

---

## 🗄️ PASO 9: Crear la Base de Datos y Tablas

Tienes dos opciones:

### Opción A: Desde MySQL Workbench (Recomendado - Visual)

1. Abre **MySQL Workbench**
2. Conecta con:
   - Host: `localhost`
   - User: `root`
   - Password: Tu contraseña MySQL
3. Copia el contenido de `/scripts/init_db.sql`
4. Pégalo en una nueva query en Workbench
5. Haz clic en ⚡ (Execute)
6. Luego copia el contenido de `/scripts/seed_db.sql`
7. Pégalo en una nueva query
8. Haz clic en ⚡ (Execute)

### Opción B: Desde CMD (Línea de Comandos)

1. Abre **CMD** o **PowerShell**
2. Navega a la carpeta del proyecto:
```bash
cd C:\ruta\a\tu\proyecto\v0-project
```

3. Ejecuta el script de creación:
```bash
mysql -u root -p < scripts/init_db.sql
```

Cuando pida contraseña, ingresa la que configuraste en MySQL

4. Luego ejecuta los datos de prueba:
```bash
mysql -u root -p < scripts/seed_db.sql
```

---

## 🚀 PASO 10: Crear el Backend (Código Python)

Ahora crearemos la estructura del backend. 

**Crea estos archivos en esta estructura:**

```
backend/
├── venv/                    (creado automáticamente)
├── src/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── domain/
│   │   ├── entities.py
│   │   └── services.py
│   ├── adapters/
│   │   ├── database_adapter.py
│   │   └── routes.py
│   └── security/
│       └── auth.py
├── .env
└── requirements.txt
```

Los archivos están listos en los scripts de este proyecto. Los crearemos en los pasos siguientes.

---

## 💾 PASO 11: Crear Archivos del Backend

### Archivo 1: `backend/src/config.py`

```python
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_NAME = os.getenv("DB_NAME", "redcomunitaria")
    
    JWT_SECRET = os.getenv("JWT_SECRET", "tu_llave_secreta")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
    
    API_PORT = int(os.getenv("API_PORT", "8000"))
    API_HOST = os.getenv("API_HOST", "0.0.0.0")

settings = Settings()
```

### Archivo 2: `backend/src/database.py`

```python
import mysql.connector
from mysql.connector import Error
from config import settings

def get_db_connection():
    """Crea una conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            database=settings.DB_NAME
        )
        if connection.is_connected():
            db_info = connection.get_server_info()
            print(f"✅ Conectado a MySQL Server versión {db_info}")
        return connection
    except Error as e:
        print(f"❌ Error al conectar: {e}")
        return None
```

### Archivo 3: `backend/src/security/auth.py`

```python
import jwt
from datetime import datetime, timedelta
import bcrypt
from config import settings

def hash_password(password: str) -> str:
    """Encripta una contraseña"""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hash: str) -> bool:
    """Verifica una contraseña contra su hash"""
    return bcrypt.checkpw(password.encode(), hash.encode())

def create_access_token(data: dict) -> str:
    """Crea un JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verifica un JWT token"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.InvalidTokenError:
        return None
```

### Archivo 4: `backend/src/adapters/routes.py`

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import get_db_connection
from security.auth import hash_password, verify_password, create_access_token, verify_token
from pydantic import BaseModel

app = FastAPI(title="RedComunitaria API", version="1.0.0")

# CORS - Permite conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class UsuarioLogin(BaseModel):
    email: str
    password: str

class UsuarioResponse(BaseModel):
    id: int
    email: str
    nombre: str
    rol: str

# ====== AUTENTICACIÓN ======

@app.post("/api/auth/login")
def login(credenciales: UsuarioLogin):
    """Endpoint de login"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conn.cursor(dictionary=True)
        
        # Buscar usuario por email
        query = "SELECT id, email, nombre, contraseña_hash, rol FROM usuarios WHERE email = %s"
        cursor.execute(query, (credenciales.email,))
        usuario = cursor.fetchone()
        
        if not usuario:
            raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
        # Verificar contraseña
        if not verify_password(credenciales.password, usuario['contraseña_hash']):
            raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
        # Crear token
        access_token = create_access_token({
            "sub": usuario['email'],
            "id": usuario['id'],
            "rol": usuario['rol']
        })
        
        cursor.close()
        conn.close()
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "usuario": {
                "id": usuario['id'],
                "email": usuario['email'],
                "nombre": usuario['nombre'],
                "rol": usuario['rol']
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/register")
def register(credenciales: UsuarioLogin):
    """Endpoint de registro"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conn.cursor()
        
        # Verificar que no exista
        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (credenciales.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="El email ya existe")
        
        # Insertar nuevo usuario
        password_hash = hash_password(credenciales.password)
        query = """
            INSERT INTO usuarios (email, nombre, contraseña_hash, rol)
            VALUES (%s, %s, %s, 'donante')
        """
        cursor.execute(query, (credenciales.email, credenciales.email, password_hash))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {"mensaje": "Usuario registrado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ====== OLLAS COMUNES ======

@app.get("/api/ollas")
def get_ollas():
    """Obtiene todas las ollas comunes"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, nombre, responsable, ubicacion, beneficiarios, 
                   estado, fecha_creacion
            FROM ollas_comunes
            ORDER BY fecha_creacion DESC
        """)
        ollas = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return {"ollas": ollas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ollas/{olla_id}")
def get_olla(olla_id: int):
    """Obtiene detalles de una olla"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, nombre, responsable, ubicacion, beneficiarios,
                   estado, fecha_creacion
            FROM ollas_comunes
            WHERE id = %s
        """, (olla_id,))
        olla = cursor.fetchone()
        
        if not olla:
            raise HTTPException(status_code=404, detail="Olla no encontrada")
        
        cursor.close()
        conn.close()
        
        return olla
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ollas")
def create_olla(data: dict):
    """Crea una nueva olla"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conn.cursor()
        query = """
            INSERT INTO ollas_comunes (nombre, responsable, ubicacion, beneficiarios, estado)
            VALUES (%s, %s, %s, %s, 'activa')
        """
        cursor.execute(query, (
            data.get('nombre'),
            data.get('responsable'),
            data.get('ubicacion'),
            data.get('beneficiarios', 0)
        ))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {"mensaje": "Olla creada exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ====== DONACIONES ======

@app.get("/api/donaciones")
def get_donaciones():
    """Obtiene todas las donaciones"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, donante, recurso, cantidad, unidad, olla_destino, 
                   estado, fecha_donacion
            FROM donaciones
            ORDER BY fecha_donacion DESC
        """)
        donaciones = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return {"donaciones": donaciones}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/donaciones")
def create_donacion(data: dict):
    """Crea una nueva donación"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conn.cursor()
        query = """
            INSERT INTO donaciones (donante, recurso, cantidad, unidad, olla_destino, estado)
            VALUES (%s, %s, %s, %s, %s, 'registrada')
        """
        cursor.execute(query, (
            data.get('donante'),
            data.get('recurso'),
            data.get('cantidad'),
            data.get('unidad'),
            data.get('olla_destino')
        ))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {"mensaje": "Donación registrada exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health check
@app.get("/api/health")
def health():
    """Verifica que el servidor está funcionando"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    from config import settings
    uvicorn.run(
        app,
        host=settings.API_HOST,
        port=settings.API_PORT
    )
```

### Archivo 5: `backend/src/main.py`

```python
# Este archivo importa desde routes.py
from adapters.routes import app

if __name__ == "__main__":
    import uvicorn
    from config import settings
    
    print(f"""
    🚀 Iniciando RedComunitaria Backend
    📡 Host: {settings.API_HOST}
    🔌 Puerto: {settings.API_PORT}
    🗄️  BD: {settings.DB_NAME}
    """)
    
    uvicorn.run(
        "adapters.routes:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
```

---

## ⚡ PASO 12: Ejecutar el Backend

1. En la terminal de VS Code, asegúrate que:
   - Estés en la carpeta `backend`
   - El entorno virtual `(venv)` esté activo
   
2. Ejecuta:
```bash
python src/main.py
```

**Deberías ver algo como:**
```
🚀 Iniciando RedComunitaria Backend
📡 Host: 0.0.0.0
🔌 Puerto: 8000
🗄️  BD: redcomunitaria

INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

---

## 🧪 PASO 13: Probar el Backend

Abre una nueva pestaña en el navegador y ve a:
```
http://localhost:8000/api/health
```

Deberías ver:
```json
{"status":"ok"}
```

---

## 🔓 PASO 14: Probar Login en el Frontend

Ahora que el backend está corriendo:

1. En VS Code, abre una **nueva terminal** (Ctrl + Ñ)
2. Ejecuta el frontend:
```bash
pnpm run dev
```

3. Abre http://localhost:4200
4. Intenta loguear con:
   - **Email**: `donante1@email.com`
   - **Contraseña**: `password123`

**¡Debería funcionar ahora!**

---

## 📊 Resumen de Puertos

| Aplicación | Puerto | URL |
|-----------|--------|-----|
| **Frontend Angular** | 4200 | http://localhost:4200 |
| **Backend FastAPI** | 8000 | http://localhost:8000 |
| **MySQL** | 3306 | localhost (sin URL) |

---

## 🆘 Solución de Problemas

### ❌ "No se puede conectar a MySQL"

**Solución:**
1. Abre Services (Win + R → services.msc)
2. Busca MySQL80
3. Si está detenido, haz clic derecho → Start
4. Verifica el usuario y contraseña en `.env`

### ❌ "ModuleNotFoundError: No module named 'fastapi'"

**Solución:**
1. Asegúrate que el entorno virtual esté activo `(venv)`
2. Reinstala: `pip install -r requirements.txt`

### ❌ "Port 8000 already in use"

**Solución:**
1. El puerto 8000 ya está ocupado
2. Cambia en `.env`: `API_PORT=8001`
3. Reinicia el servidor

### ❌ "Connection refused" en login

**Solución:**
1. Verifica que el backend esté corriendo
2. En la terminal del backend deberías ver `Uvicorn running on...`
3. Abre http://localhost:8000/api/health para verificar

---

## 🎯 Checklist Final

- ✅ Python 3.10+ instalado
- ✅ MySQL instalado y corriendo
- ✅ Base de datos `redcomunitaria` creada
- ✅ Archivo `.env` configurado
- ✅ Entorno virtual Python creado
- ✅ Dependencias instaladas
- ✅ Archivos del backend creados
- ✅ Backend corriendo en puerto 8000
- ✅ Frontend corriendo en puerto 4200
- ✅ Login funcionando

**¡Listo para usar RedComunitaria!** 🎉
