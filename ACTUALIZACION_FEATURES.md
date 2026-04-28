# Actualización de Features - RedComunitaria

## Cambios Implementados

### 1. Splash Screen con Animaciones (✅ COMPLETADO)

Se agregó un nuevo componente `SplashComponent` que muestra una pantalla de bienvenida de 3 segundos.

**Ubicación**: `src/app/presentation/components/splash/splash.component.ts`

**Características**:
- Logo animado que rota y tiene pulsos
- Texto de bienvenida personalizado con el nombre del usuario
- Barra de progreso animada
- Desvanecimiento suave después de 3 segundos
- Redirige automáticamente a `/inicio`

**Colores**:
- Gradiente Cyan #0891b2 a Navy #1e3a8a
- Animaciones suave con easing personalizado

### 2. Componente de Registro con Roles Dinámicos (✅ COMPLETADO)

Se implementó un nuevo componente `RegisterComponent` con sistema de dos pasos.

**Ubicación**: `src/app/presentation/pages/register/register.component.ts`

**Paso 1 - Seleccionar Rol**:
- Donante: Contribuye con recursos
- Responsable de Olla: Gestiona una olla común

**Paso 2 - Formulario Dinámico**:

**Campos Comunes**:
- Nombre Completo
- Email
- Teléfono
- Contraseña

**Campos para Donante**:
- Tipo de Donación (Alimentos, Dinero, Otros)
- Ubicación/Distrito

**Campos para Responsable**:
- Nombre de la Olla Común
- Ubicación de la Olla
- Número de Beneficiarios

**Validaciones**:
- Email válido
- Contraseña mínimo 6 caracteres
- Campos requeridos
- Manejo de errores backend

### 3. Carga de Datos desde Base de Datos (✅ COMPLETADO)

#### Ollas Comunes
- El componente `OllasComunesComponent` ahora carga datos del backend en `ngOnInit`
- Llamada a `OllaService.obtenerOllas()` que usa el adaptador HTTP
- Endpoint backend: `GET /api/ollas`
- Muestra los datos en una grilla responsiva

#### Donaciones
- El componente `DonacionesComponent` carga donaciones al iniciar
- Llamada a `DonacionService.obtenerDonaciones()`
- Endpoint backend: `GET /api/donaciones`
- Tabla con historial de donaciones

**Nota**: El backend debe tener datos de prueba insertados con `scripts/seed_db.sql`

### 4. Mejoras en Formularios

#### Validaciones Mejoradas:
- Mensajes de error específicos
- Campos requeridos destacados
- Feedback visual en tiempo real

#### Manejo de Errores:
- Intenta/Captura en todos los endpoints
- Mensajes de error traducidos al español
- Loading states durante envío

### 5. Rutas Actualizadas

Se agregaron dos nuevas rutas:

```typescript
{ path: 'splash', component: SplashComponent },
{ path: 'registro', component: RegisterComponent }
```

**Flujo de Navegación**:
```
Login → [Splash Screen 3s] → Inicio (Dashboard)
     ↓
  Registro → [Splash Screen 3s] → Inicio
```

### 6. Animaciones CSS Globales

Se agregaron animaciones en el Splash:
- `fadeOut`: Desvanecimiento gradual
- `bounceIn`: Entrada con rebote
- `rotate`: Rotación continua del logo
- `pulse`: Efecto de pulso en el corazón
- `dotPulse`: Puntos de radiación animados
- `slideUp`: Entrada deslizante hacia arriba
- `loadProgress`: Progreso de carga animado

**Variables CSS**:
- Duraciones: 0.3s - 3s
- Easing: ease-out, ease-in-out, linear
- Transformaciones: scale, rotate, translateY

## Cómo Probarlo

### 1. Prueba el Splash Screen
```bash
# En la web, después de login, deberías ver:
1. Splash Screen 3 segundos
2. Logo animado con pulsos
3. "Bienvenido [usuario] a RedComunitaria"
4. Redirección automática a Inicio
```

### 2. Prueba el Registro
```bash
1. Click en "Registrate aquí" en login
2. Selecciona un rol (Donante o Responsable)
3. Completa el formulario dinámico
4. Envía para crear tu cuenta
5. Verás el Splash y serás redirigido a Inicio
```

### 3. Prueba Carga de Datos
```bash
1. Ve a "Ollas Comunes"
   - Deberías ver ollas de la base de datos
   - Puedes hacer click en "Ver Detalles"
   - Puedes registrar una nueva olla

2. Ve a "Donar"
   - Deberías ver donaciones previas
   - Puedes crear una nueva donación
   - Se guardarán en la base de datos
```

## Archivos Modificados

### Nuevos Archivos:
- `src/app/presentation/components/splash/splash.component.ts`
- `src/app/presentation/pages/register/register.component.ts`

### Archivos Modificados:
- `src/app/app.routes.ts` - Agregadas rutas /splash y /registro
- `src/app/presentation/pages/login/login.component.ts` - Botón de registro funcional
- `src/app/presentation/adapters/olla.http-adapter.ts` - Actualizado endpoint URL

## Notas Técnicas

### Adaptadores HTTP
- `OllaHttpAdapter`: GET/POST/PUT/DELETE para ollas
- `DonacionHttpAdapter`: GET/POST para donaciones
- Token JWT agregado automáticamente en headers

### Base de Datos
- Datos iniciales en `scripts/seed_db.sql`
- Tablas ya creadas en `scripts/init_db.sql`
- Conexión verificada en backend

### LocalStorage
- Nombre de usuario guardado como JSON
- Email para identificar usuario
- Splash Screen lo lee automáticamente

## Troubleshooting

### Si no ves datos de Ollas/Donaciones:
1. Verifica que el backend esté ejecutándose
2. Chequea que `scripts/seed_db.sql` fue ejecutado
3. Revisa la consola del navegador para errores HTTP

### Si el Splash no aparece:
1. Revisa que `SplashComponent` esté importado en `app.routes.ts`
2. Verifica que el localStorage tenga los datos del usuario
3. Abre DevTools → Console para ver errores

### Si el Registro no funciona:
1. Verifica que el backend tenga endpoint `POST /api/auth/register`
2. Chequea que todos los campos requeridos sean llenados
3. Revisa la respuesta del backend en Network tab

## Próximos Pasos (Opcional)

Si deseas agregar más funcionalidades:
- Editar perfil de usuario
- Cambiar contraseña
- Historial de donaciones por usuario
- Dashboard de responsable con gráficos
- Notificaciones en tiempo real
- Sistema de calificación para donantes

---

**Última actualización**: 2026-04-27
**Versión**: 2.0 (Registro + Splash + Datos)
