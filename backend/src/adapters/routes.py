from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from adapters.autenticacion_routes import router as auth_router
from database import get_db_connection
from security.auth import hash_password, verify_password, create_access_token, verify_token
from pydantic import BaseModel

app = FastAPI(title="RedComunitaria API", version="1.0.0")
app.include_router(auth_router)
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
    correo: str
    contraseña: str

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
        cursor.execute(query, (credenciales.correo,))
        usuario = cursor.fetchone()
        
        if not usuario:
            raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
        # Verificar contraseña
        if not verify_password(credenciales.contraseña, usuario['contraseña_hash']):
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
        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (credenciales.correo,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="El email ya existe")
        
        # Insertar nuevo usuario
        password_hash = hash_password(credenciales.contraseña)
        query = """
            INSERT INTO usuarios (email, nombre, contraseña_hash, rol)
            VALUES (%s, %s, %s, 'donante')
        """
        cursor.execute(query, (credenciales.correo, credenciales.correo, password_hash))
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