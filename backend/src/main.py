import os
import sys
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import jwt
import bcrypt
import mysql.connector
from mysql.connector import Error as MySQLError
from typing import Optional

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

USER_SELECT_QUERY = "SELECT id, email, nombre, rol FROM usuarios WHERE id = %s"

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


def get_user_from_token(authorization: Optional[str]) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no proporcionado")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


def assert_admin(authorization: Optional[str]) -> dict:
    payload = get_user_from_token(authorization)
    if payload.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="Acceso denegado")
    return payload

# Modelos (Pydantic)
from pydantic import BaseModel

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

class UpdateProfileRequest(BaseModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

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
async def get_usuario(authorization: Optional[str] = Header(None)):
    """
    Obtiene el usuario actual desde el token
    """
    try:
        payload = get_user_from_token(authorization)
        usuario_id = payload.get("id")
        
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(USER_SELECT_QUERY, (usuario_id,))
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

@app.patch("/api/auth/usuario")
async def update_usuario(request: UpdateProfileRequest, authorization: Optional[str] = Header(None)):
    """Actualiza los datos del usuario actual"""
    try:
        payload = get_user_from_token(authorization)
        usuario_id = payload.get("id")
        if not usuario_id:
            raise HTTPException(status_code=401, detail="Token inválido")

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(USER_SELECT_QUERY, (usuario_id,))
        usuario = cursor.fetchone()
        if not usuario:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        updates = []
        values = []
        if request.nombre:
            updates.append("nombre = %s")
            values.append(request.nombre)
        if request.email:
            updates.append("email = %s")
            values.append(request.email)
        if request.password:
            updates.append("password_hash = %s")
            values.append(hash_password(request.password))

        if not updates:
            cursor.close()
            connection.close()
            raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")

        update_query = f"UPDATE usuarios SET {', '.join(updates)} WHERE id = %s"
        values.append(usuario_id)
        cursor.execute(update_query, tuple(values))
        connection.commit()

        cursor.execute(USER_SELECT_QUERY, (usuario_id,))
        actualizado = cursor.fetchone()
        cursor.close()
        connection.close()

        return actualizado
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error actualizando usuario: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al actualizar usuario")

@app.post("/api/auth/logout")
async def logout():
    return {"message": "Sesión cerrada"}

@app.post("/api/auth/verificar-token")
async def verificar_token(request: dict):
    token = request.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token no proporcionado")
    try:
        jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return True
    except Exception:
        return False

@app.get("/api/admin/dashboard")
async def admin_dashboard(authorization: Optional[str] = Header(None)):
    """Devuelve estadísticas de administración"""
    try:
        assert_admin(authorization)

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) AS total_ollas FROM ollas_comunes WHERE activa = TRUE")
        total_ollas = cursor.fetchone().get("total_ollas", 0)

        cursor.execute("SELECT COUNT(*) AS total_donantes FROM usuarios WHERE rol = 'donante'")
        total_donantes = cursor.fetchone().get("total_donantes", 0)

        cursor.execute("SELECT COUNT(*) AS total_responsables FROM usuarios WHERE rol = 'responsable'")
        total_responsables = cursor.fetchone().get("total_responsables", 0)

        cursor.execute("SELECT COUNT(*) AS total_usuarios FROM usuarios")
        total_usuarios = cursor.fetchone().get("total_usuarios", 0)

        cursor.execute("SELECT COUNT(*) AS total_donaciones FROM donaciones")
        total_donaciones = cursor.fetchone().get("total_donaciones", 0)

        cursor.close()
        connection.close()

        return {
            "total_usuarios": total_usuarios,
            "total_ollas": total_ollas,
            "total_donantes": total_donantes,
            "total_responsables": total_responsables,
            "total_donaciones": total_donaciones
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en dashboard admin: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al obtener estadísticas de administrador")

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
                d.id,
                d.donante_nombre AS donante,
                d.donante_email AS email,
                d.donante_telefono AS telefono,
                d.tipo_recurso AS recurso,
                d.cantidad_kg AS cantidad,
                COALESCE(o.nombre, CONCAT('Olla #', d.olla_destino_id)) AS ollaDestino,
                DATE_FORMAT(d.fecha_donacion, '%Y-%m-%d %H:%i:%s') AS fechaDonacion,
                d.estado
            FROM donaciones d
            LEFT JOIN ollas_comunes o ON o.id = d.olla_destino_id
            ORDER BY d.fecha_donacion DESC
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

        donor_name = donacion_data.get('donante') or donacion_data.get('donante_nombre')
        donor_email = donacion_data.get('email') or donacion_data.get('donante_email')
        donor_phone = donacion_data.get('telefono') or donacion_data.get('donante_telefono', '')
        recurso = donacion_data.get('recurso') or donacion_data.get('tipo_recurso')
        cantidad = float(donacion_data.get('cantidad') or donacion_data.get('cantidad_kg', 0))
        olla_destino_id = int(donacion_data.get('ollaDestino') or donacion_data.get('olla_destino_id', 0))
        estado = donacion_data.get('estado', 'PENDIENTE').upper()

        query = """
            INSERT INTO donaciones 
            (donante_nombre, donante_email, donante_telefono, tipo_recurso, cantidad_kg, olla_destino_id, fecha_donacion, estado)
            VALUES (%s, %s, %s, %s, %s, %s, NOW(), %s)
        """
        
        cursor.execute(query, (
            donor_name,
            donor_email,
            donor_phone,
            recurso,
            cantidad,
            olla_destino_id,
            estado
        ))
        
        connection.commit()
        inserted_id = cursor.lastrowid
        cursor.close()
        connection.close()
        
        return {"mensaje": "Donación registrada exitosamente", "id": inserted_id}
    
    except Exception as e:
        print(f"❌ Error creando donación: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al crear donación: {str(e)}")

@app.get("/api/admin/usuarios")
async def admin_list_usuarios(authorization: Optional[str] = Header(None)):
    """Lista todos los usuarios para el administrador"""
    try:
        assert_admin(authorization)

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, nombre, email, rol, fecha_creacion FROM usuarios ORDER BY nombre ASC")
        usuarios = cursor.fetchall()
        cursor.close()
        connection.close()

        return usuarios if usuarios else []
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error listando usuarios: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al listar usuarios")

@app.post("/api/admin/usuarios")
async def admin_create_usuario(usuario_data: dict, authorization: Optional[str] = Header(None)):
    """Crea un nuevo usuario desde el panel de administración"""
    try:
        assert_admin(authorization)

        nombre = usuario_data.get('nombre')
        email = usuario_data.get('email')
        password = usuario_data.get('password')
        rol = usuario_data.get('rol', 'donante')

        if not nombre or not email or not password:
            raise HTTPException(status_code=400, detail="Nombre, email y contraseña son requeridos")

        allowed_roles = ['admin', 'responsable', 'donante']
        if rol not in allowed_roles:
            raise HTTPException(status_code=400, detail=f"Rol inválido. Roles válidos: {', '.join(allowed_roles)}")

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
        if cursor.fetchone():
            cursor.close()
            connection.close()
            raise HTTPException(status_code=409, detail="El email ya está registrado")

        hashed_password = hash_password(password)
        insert_query = "INSERT INTO usuarios (email, nombre, password_hash, rol, fecha_creacion) VALUES (%s, %s, %s, %s, NOW())"
        cursor.execute(insert_query, (email, nombre, hashed_password, rol))
        connection.commit()
        usuario_id = cursor.lastrowid
        cursor.execute("SELECT id, nombre, email, rol, fecha_creacion FROM usuarios WHERE id = %s", (usuario_id,))
        nuevo_usuario = cursor.fetchone()
        cursor.close()
        connection.close()

        return nuevo_usuario
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error creando usuario admin: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al crear usuario")

@app.patch("/api/admin/usuarios/{usuario_id}")
async def admin_update_usuario(usuario_id: int, usuario_data: dict, authorization: Optional[str] = Header(None)):
    """Actualiza datos de un usuario desde el panel de administración"""
    try:
        assert_admin(authorization)

        fields = []
        values = []

        if usuario_data.get('nombre'):
            fields.append('nombre = %s')
            values.append(usuario_data.get('nombre'))
        if usuario_data.get('email'):
            fields.append('email = %s')
            values.append(usuario_data.get('email'))
        if usuario_data.get('rol'):
            allowed_roles = ['admin', 'responsable', 'donante']
            if usuario_data.get('rol') not in allowed_roles:
                raise HTTPException(status_code=400, detail=f"Rol inválido. Roles válidos: {', '.join(allowed_roles)}")
            fields.append('rol = %s')
            values.append(usuario_data.get('rol'))
        if usuario_data.get('password'):
            fields.append('password_hash = %s')
            values.append(hash_password(usuario_data.get('password')))

        if not fields:
            raise HTTPException(status_code=400, detail='No se proporcionaron datos para actualizar')

        values.append(usuario_id)
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(f"UPDATE usuarios SET {', '.join(fields)} WHERE id = %s", tuple(values))
        connection.commit()
        cursor.execute("SELECT id, nombre, email, rol, fecha_creacion FROM usuarios WHERE id = %s", (usuario_id,))
        usuario_actualizado = cursor.fetchone()
        cursor.close()
        connection.close()

        if not usuario_actualizado:
            raise HTTPException(status_code=404, detail='Usuario no encontrado')

        return usuario_actualizado
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error actualizando usuario admin: {str(e)}")
        raise HTTPException(status_code=500, detail='Error al actualizar usuario')

@app.delete("/api/admin/usuarios/{usuario_id}")
async def admin_delete_usuario(usuario_id: int, authorization: Optional[str] = Header(None)):
    """Elimina un usuario desde el panel de administración"""
    try:
        assert_admin(authorization)

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (usuario_id,))
        connection.commit()
        affected = cursor.rowcount
        cursor.close()
        connection.close()

        if affected == 0:
            raise HTTPException(status_code=404, detail='Usuario no encontrado')

        return {"mensaje": "Usuario eliminado correctamente"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error eliminando usuario admin: {str(e)}")
        raise HTTPException(status_code=500, detail='Error al eliminar usuario')

@app.get("/api/admin/roles")
async def admin_list_roles(authorization: Optional[str] = Header(None)):
    """Devuelve los roles disponibles para administración"""
    try:
        assert_admin(authorization)
        return {"roles": ["admin", "responsable", "donante"]}
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error listando roles admin: {str(e)}")
        raise HTTPException(status_code=500, detail='Error al listar roles')

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