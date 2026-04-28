import os
import sys
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
import mysql.connector
from mysql.connector import Error as MySQLError

# Cargar variables de entorno
load_dotenv()

# Configuración
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'redcomunitaria')
DB_PORT = int(os.getenv('DB_PORT', 3306))
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-change-this')
JWT_ALGORITHM = os.getenv('JWT_ALGORITHM', 'HS256')
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))
API_PORT = int(os.getenv('API_PORT', 8000))
API_HOST = os.getenv('API_HOST', '0.0.0.0')

app = FastAPI(title="RedComunitaria API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:3000", "http://127.0.0.1:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Función para conectar a MySQL
def get_db_connection():
    """Obtiene una conexión a la base de datos"""
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            autocommit=True
        )
        print(f"✅ Conectado a MySQL Server versión {connection.get_server_info()}")
        return connection
    except MySQLError as err:
        if err.errno == 1045:
            print(f"❌ Error al conectar: {err.errno} ({err.sqlstate}): {err.msg}")
        else:
            print(f"❌ Error de base de datos: {err}")
        raise HTTPException(status_code=500, detail="Error de conexión a base de datos")

# Funciones de utilidad
def hash_password(password: str) -> str:
    """Hashea una contraseña"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verifica una contraseña contra su hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict) -> str:
    """Crea un JWT token"""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

# Modelos (Pydantic)
from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    nombre: str
    email: str
    password: str
    rol: str
    telefono: Optional[str] = None
    nombre_olla: Optional[str] = None
    ubicacion: Optional[str] = None
    numero_beneficiarios: Optional[int] = None
    tipo_contribucion: Optional[str] = None

class UsuarioResponse(BaseModel):
    id: int
    email: str
    nombre: str
    rol: str

class LoginResponse(BaseModel):
    access_token: str
    usuario: UsuarioResponse

# Rutas de Autenticación
@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """
    Login endpoint
    Espera: { "email": "user@email.com", "password": "password123" }
    Retorna: { "access_token": "jwt_token", "usuario": { ... } }
    """
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Buscar usuario por email
        query = "SELECT id, email, nombre, password_hash, rol FROM usuarios WHERE email = %s"
        cursor.execute(query, (request.email,))
        usuario = cursor.fetchone()
        cursor.close()
        connection.close()
        
        if not usuario:
            raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
        # Verificar contraseña
        if not verify_password(request.password, usuario['password_hash']):
            raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
        # Crear token
        token_data = {
            "id": usuario['id'],
            "email": usuario['email'],
            "rol": usuario['rol']
        }
        access_token = create_access_token(token_data)
        
        return LoginResponse(
            access_token=access_token,
            usuario=UsuarioResponse(
                id=usuario['id'],
                email=usuario['email'],
                nombre=usuario['nombre'],
                rol=usuario['rol']
            )
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en login: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al procesar login: {str(e)}")

@app.post("/api/auth/register")
async def register(request: RegisterRequest):
    """
    Registro endpoint - Acepta datos de donante o responsable de olla
    """
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Verificar si el usuario ya existe
        query = "SELECT id FROM usuarios WHERE email = %s"
        cursor.execute(query, (request.email,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            raise HTTPException(status_code=409, detail="El email ya está registrado")
        
        # Crear usuario
        hashed_password = hash_password(request.password)
        insert_query = """
            INSERT INTO usuarios (email, nombre, password_hash, rol, fecha_creacion)
            VALUES (%s, %s, %s, %s, NOW())
        """
        cursor.execute(insert_query, (request.email, request.nombre, hashed_password, request.rol))
        connection.commit()
        
        # Obtener el usuario creado
        usuario_id = cursor.lastrowid
        
        # Si es responsable, crear la olla común
        if request.rol == 'responsable' and request.nombre_olla:
            olla_query = """
                INSERT INTO ollas_comunes (nombre, ubicacion, numero_beneficiarios, responsable_id, fecha_creacion, estado)
                VALUES (%s, %s, %s, %s, NOW(), 'activa')
            """
            cursor.execute(olla_query, (request.nombre_olla, request.ubicacion, request.numero_beneficiarios, usuario_id))
            connection.commit()
        
        cursor.close()
        connection.close()
        
        # Crear token
        token_data = {
            "id": usuario_id,
            "email": request.email,
            "rol": request.rol
        }
        access_token = create_access_token(token_data)
        
        return LoginResponse(
            access_token=access_token,
            usuario=UsuarioResponse(
                id=usuario_id,
                email=request.email,
                nombre=request.nombre,
                rol=request.rol
            )
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en registro: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al registrar usuario: {str(e)}")

@app.get("/api/auth/usuario")
async def get_usuario(authorization: Optional[str] = None):
    """
    Obtiene el usuario actual desde el token
    """
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Token no proporcionado")
        
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        usuario_id = payload.get("id")
        
        if not usuario_id:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT id, email, nombre, tipo_usuario FROM usuarios WHERE id = %s"
        cursor.execute(query, (usuario_id,))
        usuario = cursor.fetchone()
        cursor.close()
        connection.close()
        
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        return UsuarioResponse(**usuario)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error obteniendo usuario: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener usuario")

# Rutas de Ollas Comunes
@app.get("/api/ollas")
async def get_ollas():
    """Obtiene todas las ollas comunes"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                id, nombre, responsable, ubicacion, direccion, numero_beneficiarios,
                prioridad, estado, fecha_creacion
            FROM ollas_comunes
            WHERE activa = TRUE
            ORDER BY fecha_creacion DESC
        """
        cursor.execute(query)
        ollas = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return ollas if ollas else []
    
    except Exception as e:
        print(f"❌ Error obteniendo ollas: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener ollas")

@app.post("/api/ollas")
async def create_olla(olla_data: dict):
    """Crea una nueva olla común"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
            INSERT INTO ollas_comunes 
            (nombre, responsable, ubicacion, direccion, numero_beneficiarios, prioridad, estado, activa, fecha_creacion)
            VALUES (%s, %s, %s, %s, %s, %s, %s, TRUE, NOW())
        """
        
        cursor.execute(query, (
            olla_data.get('nombre'),
            olla_data.get('responsable'),
            olla_data.get('ubicacion'),
            olla_data.get('direccion', ''),
            int(olla_data.get('numero_beneficiarios', 0)),
            olla_data.get('prioridad', 'MEDIA').upper(),
            olla_data.get('estado', 'PENDIENTE').upper()
        ))
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return {"mensaje": "Olla común creada exitosamente", "id": cursor.lastrowid}
    
    except Exception as e:
        print(f"❌ Error creando olla: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al crear olla: {str(e)}")

# Rutas de Donaciones
@app.get("/api/donaciones")
async def get_donaciones():
    """Obtiene todas las donaciones"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
            SELECT 
                id, donante_nombre, donante_email, donante_telefono, tipo_recurso, cantidad_kg, 
                olla_destino_id, fecha_donacion, estado
            FROM donaciones
            ORDER BY fecha_donacion DESC
        """
        cursor.execute(query)
        donaciones = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return donaciones if donaciones else []
    
    except Exception as e:
        print(f"❌ Error obteniendo donaciones: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener donaciones: {str(e)}")

@app.post("/api/donaciones")
async def create_donacion(donacion_data: dict):
    """Crea una nueva donación"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        query = """
            INSERT INTO donaciones 
            (donante_nombre, donante_email, donante_telefono, tipo_recurso, cantidad_kg, olla_destino_id, fecha_donacion, estado)
            VALUES (%s, %s, %s, %s, %s, %s, NOW(), %s)
        """
        
        cursor.execute(query, (
            donacion_data.get('donante_nombre'),
            donacion_data.get('donante_email'),
            donacion_data.get('donante_telefono', ''),
            donacion_data.get('tipo_recurso'),
            float(donacion_data.get('cantidad_kg', 0)),
            int(donacion_data.get('olla_destino_id')),
            donacion_data.get('estado', 'PENDIENTE').upper()
        ))
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return {"mensaje": "Donación registrada exitosamente", "id": cursor.lastrowid}
    
    except Exception as e:
        print(f"❌ Error creando donación: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al crear donación: {str(e)}")

# Health check
@app.get("/api/health")
async def health_check():
    """Verifica que el servidor esté funcionando"""
    return {"status": "ok", "message": "API RedComunitaria en línea"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"mensaje": "API RedComunitaria v1.0.0"}

# Ejecutar servidor
if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Iniciando servidor en {API_HOST}:{API_PORT}")
    uvicorn.run(app, host=API_HOST, port=API_PORT)
    print(hash_password("123456"))