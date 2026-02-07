# 🌍 Headway Trips - Agencia de Viajes

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ecf8e?logo=supabase)](https://supabase.com/)

Plataforma web moderna para agencia de viajes, desarrollada con Next.js 15+, TypeScript, Tailwind CSS y Supabase.

## ✨ Características

### Frontend

- 🎨 **Diseño profesional** generado con v0.dev
- 📱 **Completamente responsive** (mobile-first)
- ⚡ **Optimizado con Turbopack** para desarrollo rápido
- 🌙 **Dark mode** listo (con theme provider)
- ♿ **Accesibilidad** (WCAG 2.1)
- 🎭 **Animaciones fluidas** con Framer Motion

### Backend

- 🔐 **Autenticación** con Supabase Auth
- 🗄️ **Base de datos** PostgreSQL (Supabase)
- 📊 **Panel de administración** completo
- 📧 **Sistema de cotizaciones** y contacto
- 🔍 **Búsqueda y filtrado** de destinos
- 📈 **Comparador de viajes** (hasta 3 destinos)

### SEO y Performance

- 🚀 **Core Web Vitals** optimizados
- 🔍 **SEO** con metadata dinámica
- 📱 **PWA** ready (manifest + service worker)
- 📊 **Google Analytics** integrado
- 🐛 **Sentry** para monitoreo de errores

---

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
Node.js >= 18.17.0
pnpm >= 8.x (recomendado)
```

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd travel-agency-mvp
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

El archivo `.env.local` ya está configurado con las credenciales de Supabase:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://nsgbmppylrowvggmckhi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Otros
NEXT_PUBLIC_WHATSAPP_NUMBER=5491112345678
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Iniciar servidor de desarrollo**

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📂 Estructura del Proyecto

```
travel-agency-mvp/
├── app/                      # Rutas de Next.js (App Router)
│   ├── page.tsx             # Página principal
│   ├── layout.tsx           # Layout raíz
│   ├── viaje/[id]/          # Detalles de viaje dinámico
│   ├── comparador/          # Comparador de destinos
│   ├── admin/               # Panel de administración
│   └── api/                 # API Routes
│       ├── contact/         # Formulario de contacto
│       ├── quotes/          # Sistema de cotizaciones
│       ├── trips/           # CRUD de viajes
│       └── admin/           # APIs del admin
├── components/              # Componentes React
│   ├── ui/                  # Componentes shadcn/ui
│   ├── header.tsx
│   ├── hero.tsx
│   ├── trip-grid.tsx
│   └── ...
├── hooks/                   # Custom React hooks
│   ├── use-wishlist.ts
│   ├── use-debounce.ts
│   └── ...
├── lib/                     # Utilidades y helpers
│   ├── supabase.ts          # Cliente Supabase
│   ├── auth.ts              # Autenticación
│   ├── trips-data.ts        # Data de viajes
│   └── ...
├── public/                  # Assets estáticos
│   ├── *.jpg, *.webp        # Imágenes
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Service Worker
├── supabase/               # Configuración de Supabase
│   ├── schema.sql           # Esquema de BD
│   └── seed.sql             # Datos iniciales
├── tests/                   # Tests E2E (Playwright)
│   └── e2e.spec.ts
├── .env.local              # Variables de entorno
├── middleware.ts           # Middleware de autenticación
└── package.json
```

---

## 🎯 Funcionalidades Principales

### 1. Catálogo de Destinos

- ✅ Grid de destinos con imágenes optimizadas
- ✅ Filtrado por región (Sudamérica, Europa, etc.)
- ✅ Búsqueda en tiempo real
- ✅ Ordenamiento por precio y popularidad

### 2. Detalles de Viaje

- ✅ Galería de imágenes
- ✅ Información detallada
- ✅ Formulario de cotización
- ✅ Compartir en redes sociales
- ✅ Botón de WhatsApp directo

### 3. Comparador de Destinos

- ✅ Comparar hasta 3 viajes
- ✅ Tabla comparativa de características
- ✅ Filtros y ordenamiento
- ✅ Exportar comparación (futuro)

### 4. Panel de Administración

- ✅ Login seguro con Supabase Auth
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de viajes
- ✅ Gestión de cotizaciones
- ✅ Mensajes de contacto
- ✅ Upload de imágenes

### 5. Sistema de Cotizaciones

- ✅ Formulario con validación
- ✅ Almacenamiento en Supabase
- ✅ Notificaciones al admin
- ✅ Seguimiento de estados

---

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

#### `trips` - Viajes/Destinos

```sql
- id (TEXT, PK)
- title, subtitle, region
- description, duration, price
- images[], highlights[], tags[]
- disponibilidad y configuración
```

#### `quote_requests` - Cotizaciones

```sql
- id (UUID, PK)
- trip_id (FK)
- customer_name, email, phone
- travel_date, adults, children
- status, quoted_price
```

#### `bookings` - Reservas Confirmadas

```sql
- id (UUID, PK)
- quote_request_id (FK opcional)
- trip_id (FK)
- información del cliente
- payment status
```

### Configurar Base de Datos

1. **Crear proyecto en Supabase** (ya configurado)
2. **Ejecutar schema.sql**

```bash
# Copiar contenido de supabase/schema.sql
# Pegar en Supabase SQL Editor y ejecutar
```

3. **Cargar datos iniciales (opcional)**

```bash
# Copiar contenido de supabase/seed.sql
# Ejecutar en SQL Editor
```

---

## 🧪 Testing

### Tests E2E con Playwright

```bash
# Ejecutar todos los tests
pnpm playwright test

# Ejecutar en modo headed (con navegador visible)
pnpm playwright test --headed

# Ejecutar un test específico
pnpm playwright test tests/e2e.spec.ts

# Ver reporte
pnpm playwright show-report
```

### Tests Incluidos

- ✅ Navegación principal
- ✅ Listado de viajes
- ✅ Detalles de viaje
- ✅ Comparador de destinos
- ✅ Formulario de contacto
- ✅ Panel de administración

---

## 🏗️ Build y Deploy

### Build de Producción

```bash
pnpm build
```

### Ejecutar Producción Localmente

```bash
pnpm start
```

### Deploy en Vercel (Recomendado)

1. **Conectar repositorio** en Vercel
2. **Configurar variables de entorno**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_GA_ID`
   - `NEXT_PUBLIC_SITE_URL`

3. **Deploy automático** en cada push a main

### Deploy en Netlify

```bash
# Build command
pnpm build

# Publish directory
.next
```

---

## 🔧 Comandos Disponibles

```bash
pnpm dev          # Desarrollo con Turbopack
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linter (ESLint)
pnpm playwright test  # Tests E2E
```

---

## 🎨 Personalización

### Tema y Colores

Editar `app/globals.css`:

```css
:root {
  --primary: 210 100% 50%;
  --secondary: 210 40% 96%;
  --accent: 210 100% 50%;
  /* ... */
}
```

### Datos de Viajes

Editar `lib/trips-data.ts`:

```typescript
export const trips: Trip[] = [
  {
    id: 'mi-viaje',
    title: 'Mi Destino',
    region: 'sudamerica',
    // ...
  },
];
```

### Configuración de WhatsApp

Editar `.env.local`:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5491112345678
```

---

## 📦 Tecnologías Utilizadas

### Core

- **Next.js 16** - Framework React
- **TypeScript 5** - Lenguaje tipado
- **Tailwind CSS 3** - Estilos
- **Supabase** - Backend as a Service

### UI/UX

- **shadcn/ui** - Componentes React
- **Radix UI** - Primitivos accesibles
- **Lucide React** - Iconos
- **Framer Motion** - Animaciones

### Desarrollo

- **pnpm** - Package manager
- **Playwright** - Tests E2E
- **ESLint** - Linter
- **Prettier** - Formateador

### Monitoreo

- **Sentry** - Error tracking
- **Vercel Analytics** - Analytics
- **Google Analytics** - Métricas

---

## 🐛 Solución de Problemas

### Error: "Supabase not configured"

Verificar que `.env.local` tenga las variables correctas:

```bash
cat .env.local | grep SUPABASE
```

### Error: "Module not found"

Reinstalar dependencias:

```bash
rm -rf node_modules .next
pnpm install
```

### Error en tests de Playwright

Instalar navegadores:

```bash
pnpm playwright install
```

### Build falla

Verificar errores de TypeScript:

```bash
pnpm tsc --noEmit
```

---

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

---

## 🤝 Contacto

Para soporte o consultas:

- **Email:** contacto@headwaytrips.com
- **WhatsApp:** +525527118391

---

## 📝 Changelog

### v1.0.0 - Frontend Profesional (v0.dev)

- ✨ Diseño completamente renovado
- ✨ Header con efecto de scroll
- ✨ Hero con estadísticas
- ✨ Componentes optimizados
- ✅ Backend 100% funcional
- ✅ Conexión Supabase activa
- ✅ Tests E2E passing

---

**Desarrollado con ❤️ por Headway Trips**
