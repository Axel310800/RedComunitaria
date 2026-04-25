# Verificar Configuración del Proyecto - Angular 19

## 1️⃣ Verificar Dependencias

```bash
# Ver versiones instaladas
pnpm list @angular/core @angular/cli zone.js tailwindcss

# Debería mostrar:
# @angular/core 19.2.21
# @angular/cli 19.2.24
# zone.js 0.15.1
# tailwindcss 3.4.19
```

## 2️⃣ Verificar Configuración

```bash
# Estar en el directorio raíz del proyecto
cd /vercel/share/v0-project

# Verificar que estos archivos existen:
ls -la | grep -E "angular.json|tsconfig|postcss|tailwind"

# Debe mostrar:
# angular.json
# tsconfig.json
# tsconfig.app.json
# postcss.config.js
# tailwind.config.ts
```

## 3️⃣ Iniciar el Servidor de Desarrollo

```bash
# Opción 1: Usar npm script
pnpm run dev

# Opción 2: Usar Angular CLI directamente
pnpm exec ng serve

# Opción 3: Con puerto específico
pnpm exec ng serve --port 4200
```

**Salida esperada:**
```
✔ Compiled successfully.
✔ Built successfully.

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200 **

✔ Compiled successfully.
```

## 4️⃣ Acceder a la Aplicación

1. Abre tu navegador
2. Navega a `http://localhost:4200`
3. Deberías ver la página de Login de RedComunitaria

## 5️⃣ Probar Funcionalidades

### Credenciales de Prueba
```
Email: donante1@email.com
Contraseña: password123
```

### Flujo de Prueba
1. **Login** → Ingresa con las credenciales de arriba
2. **Home** → Verifica estadísticas
3. **Ollas Comunes** → Lista de ollas con modal de detalles
4. **Donar** → Formulario para crear donación
5. **Navbar** → Verifica que aparezca el botón de cerrar sesión

## 6️⃣ Troubleshooting

### Error: "Module not found"
```bash
# Reinstalar dependencias
pnpm install

# Limpiar cache
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Zone.js version mismatch"
✅ Ya está solucionado en esta versión (zona.js 0.15.0)

### Error: "Tailwind CSS not working"
```bash
# Verificar archivo styles.css
cat src/styles.css | head -10

# Debería incluir:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

### Error: "Cannot find module '@angular/...'
```bash
# Asegúrate de que package.json tiene Angular 19
cat package.json | grep "@angular"

# Si hay conflictos, limpia e instala:
pnpm install --force
```

## 7️⃣ Verificar Build Producción

```bash
# Compilar para producción
pnpm run build

# Verificar output
ls -la dist/redcomunitaria/

# Debería existir index.html y los bundles
```

## 8️⃣ Información del Sistema

```bash
# Ver versión de Node
node --version

# Ver versión de PNPM
pnpm --version

# Ver información de sistema
cat /etc/os-release (Linux)
# o
sw_vers (macOS)
```

## ✅ Verificación Rápida (1 minuto)

Ejecuta este comando para verificar todo:

```bash
cd /vercel/share/v0-project && \
echo "1. Verificando Node..." && node --version && \
echo "2. Verificando PNPM..." && pnpm --version && \
echo "3. Verificando Angular..." && pnpm exec ng --version && \
echo "4. Verificando Tailwind..." && pnpm list tailwindcss | grep tailwindcss && \
echo "✅ ¡Todo listo!"
```

## 📊 Checklist Final

- [ ] Angular 19 instalado
- [ ] Tailwind CSS configurado
- [ ] `ng serve` funciona sin errores
- [ ] Página de login aparece en http://localhost:4200
- [ ] Formularios responden a input
- [ ] Navbar se renderiza correctamente
- [ ] Estilos Tailwind se aplican correctamente

---

**Si todo funciona correctamente, ¡el proyecto está listo para desarrollo!** 🚀
