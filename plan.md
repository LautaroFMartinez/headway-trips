# Plan: Portal de Historial de Reservas para Clientes

## Resumen
Portal público en `/mis-reservas` donde el cliente puede autenticarse con **magic link (OTP por email)** o **Google Auth**, y ver todas las reservas asociadas a su email.

## Enfoque de Auth
- Usar **Supabase Auth** (ya configurado para admin) pero ahora también para clientes públicos
- NO se necesita tabla nueva: la autenticación es solo para validar que el email pertenece al usuario
- Magic link = `signInWithOtp({ email })` de Supabase (envía email con link)
- Google = `signInWithOAuth({ provider: 'google' })` (requiere activar Google en Supabase dashboard)
- El middleware actual solo protege `/admin/*`, por lo que `/mis-reservas` no se ve afectado

## Pasos

### 1. Auth callback route (`app/auth/callback/route.ts`)
- Route handler GET que intercambia el `code` de Supabase Auth por una sesión
- Necesario para magic link y Google OAuth (ambos redirigen con `?code=...`)
- Redirige a `/mis-reservas` después de validar

### 2. Actualizar middleware (`middleware.ts`)
- Agregar `/mis-reservas` al matcher para que las cookies de sesión se refresquen
- NO proteger la ruta (la protección la maneja el componente cliente)

### 3. Página de login/portal (`app/mis-reservas/page.tsx`)
- Client component con dos estados:
  - **No autenticado**: formulario con email + botón "Enviar magic link" + botón "Continuar con Google"
  - **Autenticado**: lista de reservas del usuario
- Usa `createBrowserClient()` de `lib/auth.ts` para auth en el cliente
- Escucha `onAuthStateChange` para detectar sesión

### 4. API de reservas por email (`app/api/bookings/my-bookings/route.ts`)
- GET protegido: lee la sesión del usuario autenticado (usando Supabase con cookies)
- Busca en `bookings` WHERE `customer_email = user.email`
- Incluye datos del viaje (join con trips: title, departure_date, cover)
- Incluye pagos (join con booking_payments: suma total pagada)
- Devuelve la lista ordenada por fecha de creación (más reciente primero)

### 5. Componente de lista de reservas (`components/booking/MyBookingsList.tsx`)
- Recibe las reservas y las muestra en cards
- Cada card muestra: nombre del viaje, fecha, pasajeros, estado, monto pagado vs total, imagen de portada
- Estados con badges de color: pending (amarillo), confirmed (azul), paid (verde), cancelled (rojo)
- Link a detalle de reserva si aplica (o expandir inline)

### 6. Componente de detalle expandible por reserva
- Info del viaje, pasajeros, historial de pagos
- Si `details_completed = false` y no expiró → link a `/reserva/completar?token=...`

## Archivos a crear/modificar
- **Crear**: `app/auth/callback/route.ts`
- **Crear**: `app/mis-reservas/page.tsx`
- **Crear**: `app/api/bookings/my-bookings/route.ts`
- **Crear**: `components/booking/MyBookingsList.tsx`
- **Modificar**: `middleware.ts` (agregar `/mis-reservas` al matcher)

## Notas
- Google OAuth requiere configuración en el dashboard de Supabase (activar provider, client ID/secret de Google Cloud)
- El magic link usa el email de Supabase Auth, no se necesita infraestructura adicional
- No se crea ninguna tabla nueva: se reutiliza `bookings` filtrando por `customer_email`
