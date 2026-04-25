# Backend - Referencia Rápida

## 🎯 En 3 Pasos (Resumen Ultra Rápido)

### PASO 1: Preparar Python y BD
```bash
# Instalar Python 3.10+ desde https://www.python.org/downloads/
# Instalar MySQL 8.0+ desde https://dev.mysql.com/downloads/mysql/

# Crear entorno virtual
cd backend
python -m venv venv
venv\Scripts\activate.bat  # Windows CMD
# o
venv\Scripts\Activate.ps1  # Windows PowerShell

# Instalar dependencias
pip install fastapi uvicorn mysql-connector-python sqlalchemy pyjwt python-dotenv bcrypt
```

### PASO 2: Configurar BD
```bash
# Crear base de datos (opción A: línea de comandos)
mysql -u root -p < ../scripts/init_db.sql
mysql -u root -p < ../scripts/seed_db.sql

# Opción B: MySQL Workbench
# Abre el archivo scripts/init_db.sql y ejecuta (F5 o botón Execute)
# Luego ejecuta scripts/seed_db.sql
```

### PASO 3: Crear archivo .env
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=admin123
DB_NAME=redcomunitaria
JWT_SECRET=tu_llave_secreta_aqui
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
API_PORT=8000
API_HOST=0.0.0.0
```

### PASO 4: Crear carpeta de código
```
backend/src/
├── main.py
├── config.py
├── database.py
├── adapters/
│   └── routes.py
└── security/
    └── auth.py
```

### PASO 5: Ejecutar
```bash
# Asegúrate que estés en /backend con (venv) activado
python src/main.py

# Deberías ver:
# ✅ INFO:     Uvicorn running on http://0.0.0.0:8000
```

---

## 🧪 Verificar que funciona

```bash
# En otra terminal/ventana del navegador, visita:
http://localhost:8000/api/health
# Deberías ver: {"status":"ok"}
```

---

## 📝 Credenciales de Prueba

```
Email: donante1@email.com
Contraseña: password123
```

---

## 🔄 Flujo Completo

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   venv\Scripts\activate.bat
   python src/main.py
   # Verás: "Uvicorn running on http://0.0.0.0:8000"
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd ..
   pnpm run dev
   # Verás: "Application bundle generation complete"
   ```

3. **Abrir navegador:**
   - Frontend: http://localhost:4200
   - Backend: http://localhost:8000/api/health
   - Loguear con donante1@email.com / password123

---

## ⚠️ Problemas Comunes

| Problema | Solución |
|----------|----------|
| `ModuleNotFoundError: fastapi` | Activa venv: `venv\Scripts\activate.bat` |
| `Connection refused (MySQL)` | Inicia MySQL desde Services (services.msc) |
| `Port 8000 already in use` | Cambia API_PORT=8001 en .env |
| `Access denied for user root` | Verifica contraseña en .env |
| `Database 'redcomunitaria' doesn't exist` | Corre: `mysql -u root -p < scripts/init_db.sql` |

---

## 📚 Para más detalles ver:
- `BACKEND_SETUP_PASO_A_PASO.md` - Guía completa
- `BACKEND_GUIDE.md` - Estructura del código
- `PROJECT_SUMMARY.md` - Resumen general
