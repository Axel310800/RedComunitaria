# Guía de Implementación del Backend - RedComunitaria

Este documento proporciona las instrucciones para implementar el backend en Python con FastAPI.

## Estructura del Backend

```
backend/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── olla.py
│   │   │   ├── donacion.py
│   │   │   ├── usuario.py
│   │   │   └── necesidad.py
│   │   ├── repositories/
│   │   │   ├── olla_repository.py (Interfaz)
│   │   │   ├── donacion_repository.py (Interfaz)
│   │   │   └── usuario_repository.py (Interfaz)
│   │   └── services/
│   │       ├── olla_service.py
│   │       ├── donacion_service.py
│   │       ├── usuario_service.py
│   │       └── distribucion_service.py
│   │
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── olla_dto.py
│   │   │   ├── donacion_dto.py
│   │   │   └── usuario_dto.py
│   │   └── commands/
│   │       ├── crear_olla_command.py
│   │       ├── crear_donacion_command.py
│   │       └── registrar_usuario_command.py
│   │
│   ├── adapters/
│   │   ├── database/
│   │   │   ├── mysql_olla_repository.py
│   │   │   ├── mysql_donacion_repository.py
│   │   │   ├── mysql_usuario_repository.py
│   │   │   ├── models.py (SQLAlchemy models)
│   │   │   └── database.py (Conexión)
│   │   ├── http/
│   │   │   ├── routes/
│   │   │   │   ├── olla_routes.py
│   │   │   │   ├── donacion_routes.py
│   │   │   │   ├── usuario_routes.py
│   │   │   │   └── autenticacion_routes.py
│   │   │   └── middleware/
│   │   │       └── auth_middleware.py
│   │   └── security/
│   │       ├── jwt_handler.py
│   │       └── password_hasher.py
│   │
│   ├── infrastructure/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── dependency_injection.py
│   │
│   └── main.py
│
├── scripts/
│   ├── init_db.sql
│   ├── seed_db.sql
│   └── create_indexes.sql
│
├── requirements.txt
├── .env.example
└── .env (local, no commit)
```

## Pasos de Implementación

### 1. Entidades de Dominio

**src/domain/entities/usuario.py**
```python
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Usuario:
    id: Optional[int] = None
    email: str = ""
    nombre: str = ""
    contraseña_hash: str = ""
    rol: str = "donante"  # admin, donante, voluntario
    fecha_creacion: Optional[datetime] = None
```

**src/domain/entities/olla.py**
```python
from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List

@dataclass
class OllaComunas:
    id: Optional[int] = None
    nombre: str = ""
    responsable: str = ""
    ubicacion: str = ""
    direccion: str = ""
    numero_beneficiarios: int = 0
    prioridad: str = "MEDIA"
    estado: str = "PENDIENTE"
    fecha_creacion: Optional[datetime] = None
    necesidades: List = None
    stock: List = None
```

### 2. Repositorios (Interfaces)

**src/domain/repositories/olla_repository.py**
```python
from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entities.olla import OllaComunas

class OllaRepository(ABC):
    @abstractmethod
    async def obtener_todas(self) -> List[OllaComunas]:
        pass

    @abstractmethod
    async def obtener_por_id(self, id: int) -> Optional[OllaComunas]:
        pass

    @abstractmethod
    async def crear(self, olla: OllaComunas) -> OllaComunas:
        pass

    @abstractmethod
    async def actualizar(self, id: int, olla: OllaComunas) -> OllaComunas:
        pass

    @abstractmethod
    async def eliminar(self, id: int) -> bool:
        pass
```

### 3. Servicios (Casos de Uso)

**src/domain/services/olla_service.py**
```python
from typing import List, Optional
from src.domain.repositories.olla_repository import OllaRepository
from src.domain.entities.olla import OllaComunas

class OllaService:
    def __init__(self, repository: OllaRepository):
        self.repository = repository

    async def obtener_todas(self) -> List[OllaComunas]:
        return await self.repository.obtener_todas()

    async def obtener_por_id(self, id: int) -> Optional[OllaComunas]:
        return await self.repository.obtener_por_id(id)

    async def crear_olla(self, olla: OllaComunas) -> OllaComunas:
        return await self.repository.crear(olla)

    async def actualizar_olla(self, id: int, olla: OllaComunas) -> OllaComunas:
        return await self.repository.actualizar(id, olla)

    async def eliminar_olla(self, id: int) -> bool:
        return await self.repository.eliminar(id)
```

### 4. Adaptadores - Modelos SQLAlchemy

**src/adapters/database/models.py**
```python
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Decimal, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class UsuarioModel(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    nombre = Column(String(255), nullable=False)
    contraseña_hash = Column(String(255), nullable=False)
    rol = Column(Enum('admin', 'donante', 'voluntario'), default='donante')
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    activo = Column(Boolean, default=True)

class OllaComunesModel(Base):
    __tablename__ = "ollas_comunes"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    responsable = Column(String(255), nullable=False)
    ubicacion = Column(String(255), nullable=False)
    direccion = Column(Text, nullable=False)
    numero_beneficiarios = Column(Integer, nullable=False)
    prioridad = Column(Enum('BAJA', 'MEDIA', 'ALTA'), default='MEDIA')
    estado = Column(Enum('VALIDADA', 'PENDIENTE'), default='PENDIENTE')
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    
    necesidades = relationship("NecesidadModel", back_populates="olla")
    stocks = relationship("StockDisponibleModel", back_populates="olla")
    donaciones = relationship("DonacionModel", back_populates="olla_destino")

class NecesidadModel(Base):
    __tablename__ = "necesidades"
    
    id = Column(Integer, primary_key=True)
    olla_id = Column(Integer, ForeignKey('ollas_comunes.id'), nullable=False)
    tipo_necesidad = Column(String(100), nullable=False)
    descripcion = Column(Text)
    prioridad = Column(Enum('BAJA', 'MEDIA', 'ALTA'), default='MEDIA')
    
    olla = relationship("OllaComunesModel", back_populates="necesidades")

class StockDisponibleModel(Base):
    __tablename__ = "stocks_disponibles"
    
    id = Column(Integer, primary_key=True)
    olla_id = Column(Integer, ForeignKey('ollas_comunes.id'), nullable=False)
    tipo_recurso = Column(String(100), nullable=False)
    cantidad_kg = Column(Decimal(10, 2), nullable=False)
    
    olla = relationship("OllaComunesModel", back_populates="stocks")

class DonacionModel(Base):
    __tablename__ = "donaciones"
    
    id = Column(Integer, primary_key=True)
    donante_nombre = Column(String(255), nullable=False)
    donante_email = Column(String(255), nullable=False)
    donante_telefono = Column(String(20))
    tipo_recurso = Column(String(100), nullable=False)
    cantidad_kg = Column(Decimal(10, 2), nullable=False)
    olla_destino_id = Column(Integer, ForeignKey('ollas_comunes.id'), nullable=False)
    mensaje = Column(Text)
    estado = Column(Enum('ENTREGADA', 'PENDIENTE', 'EN_TRÁNSITO'), default='PENDIENTE')
    fecha_donacion = Column(DateTime, default=datetime.utcnow)
    
    olla_destino = relationship("OllaComunesModel", back_populates="donaciones")
```

### 5. Adaptadores - Repositorio MySQL

**src/adapters/database/mysql_olla_repository.py**
```python
from typing import List, Optional
from sqlalchemy.orm import Session
from src.domain.repositories.olla_repository import OllaRepository
from src.domain.entities.olla import OllaComunas
from src.adapters.database.models import OllaComunesModel, NecesidadModel, StockDisponibleModel

class MysqlOllaRepository(OllaRepository):
    def __init__(self, db: Session):
        self.db = db

    async def obtener_todas(self) -> List[OllaComunas]:
        modelos = self.db.query(OllaComunesModel).all()
        return [self._mapear_modelo(m) for m in modelos]

    async def obtener_por_id(self, id: int) -> Optional[OllaComunas]:
        modelo = self.db.query(OllaComunesModel).filter(OllaComunesModel.id == id).first()
        return self._mapear_modelo(modelo) if modelo else None

    async def crear(self, olla: OllaComunas) -> OllaComunas:
        modelo = OllaComunesModel(
            nombre=olla.nombre,
            responsable=olla.responsable,
            ubicacion=olla.ubicacion,
            direccion=olla.direccion,
            numero_beneficiarios=olla.numero_beneficiarios,
            prioridad=olla.prioridad,
            estado=olla.estado
        )
        self.db.add(modelo)
        self.db.commit()
        self.db.refresh(modelo)
        return self._mapear_modelo(modelo)

    async def actualizar(self, id: int, olla: OllaComunas) -> OllaComunas:
        modelo = self.db.query(OllaComunesModel).filter(OllaComunesModel.id == id).first()
        if not modelo:
            raise ValueError(f"Olla {id} no encontrada")
        
        modelo.nombre = olla.nombre
        modelo.responsable = olla.responsable
        modelo.ubicacion = olla.ubicacion
        modelo.direccion = olla.direccion
        modelo.numero_beneficiarios = olla.numero_beneficiarios
        modelo.prioridad = olla.prioridad
        modelo.estado = olla.estado
        
        self.db.commit()
        self.db.refresh(modelo)
        return self._mapear_modelo(modelo)

    async def eliminar(self, id: int) -> bool:
        modelo = self.db.query(OllaComunesModel).filter(OllaComunesModel.id == id).first()
        if not modelo:
            return False
        self.db.delete(modelo)
        self.db.commit()
        return True

    def _mapear_modelo(self, modelo: OllaComunesModel) -> OllaComunas:
        return OllaComunas(
            id=modelo.id,
            nombre=modelo.nombre,
            responsable=modelo.responsable,
            ubicacion=modelo.ubicacion,
            direccion=modelo.direccion,
            numero_beneficiarios=modelo.numero_beneficiarios,
            prioridad=modelo.prioridad,
            estado=modelo.estado,
            fecha_creacion=modelo.fecha_creacion,
            necesidades=[],
            stock=[]
        )
```

### 6. Routes (HTTP)

**src/adapters/http/routes/olla_routes.py**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.domain.services.olla_service import OllaService
from src.adapters.database.mysql_olla_repository import MysqlOllaRepository
from src.adapters.database.database import get_db
from src.application.dtos.olla_dto import OllaDTO, CreateOllaDTO

router = APIRouter(prefix="/api/ollas-comunes", tags=["ollas"])

@router.get("")
async def obtener_ollas(db: Session = Depends(get_db)):
    repository = MysqlOllaRepository(db)
    service = OllaService(repository)
    ollas = await service.obtener_todas()
    return [OllaDTO.from_entity(olla) for olla in ollas]

@router.get("/{id}")
async def obtener_olla(id: int, db: Session = Depends(get_db)):
    repository = MysqlOllaRepository(db)
    service = OllaService(repository)
    olla = await service.obtener_por_id(id)
    if not olla:
        return {"error": "Olla no encontrada"}, 404
    return OllaDTO.from_entity(olla)

@router.post("")
async def crear_olla(dto: CreateOllaDTO, db: Session = Depends(get_db)):
    repository = MysqlOllaRepository(db)
    service = OllaService(repository)
    olla = await service.crear_olla(dto.to_entity())
    return OllaDTO.from_entity(olla)
```

### 7. Main FastAPI

**src/main.py**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.adapters.http.routes import olla_routes, donacion_routes, autenticacion_routes
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="RedComunitaria API",
    description="Sistema de Distribución Equitativa de Recursos",
    version="1.0.0"
)

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:4200,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(autenticacion_routes.router)
app.include_router(olla_routes.router)
app.include_router(donacion_routes.router)

@app.get("/")
async def root():
    return {"message": "RedComunitaria API v1.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Ejecución

```bash
# Entrar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos
mysql -u root -p < ../scripts/init_db.sql
mysql -u root -p redcomunitaria < ../scripts/seed_db.sql

# Crear .env
cp .env.example .env
# Editar .env con credenciales reales

# Ejecutar servidor
python -m uvicorn src.main:app --reload
```

El servidor estará en `http://localhost:8000`

## Documentación Interactiva

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

```bash
pytest
```

---

**Nota**: Este es un esqueleto que requiere implementación completa de cada componente. La estructura y patrones están listos para extender.
