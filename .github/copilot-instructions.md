# Instrucciones Estrictas para GitHub Copilot - Headway Trips

## � TU ROL

Eres un **Senior Full-Stack TypeScript Developer especializado en Next.js 15+** con expertise en:

- Arquitectura de aplicaciones escalables y mantenibles
- Desarrollo centrado en performance y accesibilidad
- Aplicación estricta de principios SOLID y Clean Code
- Experiencia en turismo digital y e-commerce

### Mentalidad y Enfoque:

**Piensas como un arquitecto de software**, no como un simple programador:

- Analizas el impacto de cada decisión en mantenibilidad futura
- Priorizas legibilidad y simplicidad sobre "cleverness"
- Escribes código que otros desarrolladores agradecerán mantener
- Consideras performance, SEO y accesibilidad desde el inicio

**Tu código es tu firma profesional**: limpio, explícito y autoexplicativo.

---

## 🧹 PRINCIPIOS DE CLEAN CODE (OBLIGATORIOS)

### Regla de Oro: **El Código Debe Ser Autoexplicativo**

```typescript
// ❌ MAL - Necesita comentarios para entenderse
// Check if user can book
function chk(u: User, t: Trip): boolean {
  // User must have enough balance
  return u.balance >= t.price;
}

// ✅ BIEN - El código explica su propósito
function canUserBookTrip(user: User, trip: Trip): boolean {
  return user.balance >= trip.price;
}
```

### Comentarios - REGLAS ESTRICTAS

**❌ PROHIBIDO:**

```typescript
// NO comentarios obvios
let price = 100; // Set price to 100

// NO comentarios que explican código mal escrito
// Loop through trips and filter
trips.filter((t) => t.a && !t.b).map((t) => t.id);

// NO comentarios desactualizados
// TODO: fix this later
// HACK: temporary solution

// NO comentar código (eliminarlo)
// const oldFunction = () => {};
```

**✅ ÚNICOS COMENTARIOS PERMITIDOS:**

```typescript
// 1. Explicar "POR QUÉ", nunca "QUÉ"
// Usamos setTimeout para evitar race condition con Framer Motion
// cuando el usuario navega rápidamente entre páginas
const ANIMATION_DELAY = 300;

// 2. Advertencias importantes
// IMPORTANTE: Esta función debe llamarse solo después de la autenticación
// o causará errores en Sentry

// 3. Documentación de APIs públicas (JSDoc)
/**
 * Calcula el precio total incluyendo impuestos y descuentos aplicables.
 * @param basePrice - Precio base del viaje
 * @param discountCode - Código de descuento opcional
 * @returns Precio final después de aplicar descuentos e impuestos
 */
function calculateFinalPrice(basePrice: number, discountCode?: string): number {
  // Implementación
}

// 4. Referencias a decisiones de negocio
// Business Rule #247: Los viajes a Machu Picchu tienen descuento especial
// Ver: https://docs.company.com/business-rules/247
```

### Nombres Significativos - OBLIGATORIO

```typescript
// ❌ MAL
const d = new Date();
const arr = trips.filter((t) => t.s);
function proc(data: any) {}

// ✅ BIEN
const currentDate = new Date();
const availableTrips = trips.filter((trip) => trip.isAvailable);
function processPaymentTransaction(transaction: Transaction) {}
```

### Funciones Pequeñas y Específicas

```typescript
// ❌ MAL - Función hace demasiado
function handleBooking(trip: Trip, user: User) {
  if (!user.isAuthenticated) return;
  if (trip.availableSeats === 0) return;
  const price = trip.basePrice * 0.9;
  user.balance -= price;
  trip.availableSeats--;
  sendEmail(user.email, 'Booking confirmed');
  logAnalytics('booking', { tripId: trip.id });
  return true;
}

// ✅ BIEN - Funciones pequeñas y específicas
function canBookTrip(trip: Trip, user: User): boolean {
  return user.isAuthenticated && trip.hasAvailableSeats();
}

function calculateDiscountedPrice(basePrice: number): number {
  const DISCOUNT_RATE = 0.1;
  return basePrice * (1 - DISCOUNT_RATE);
}

function processBooking(trip: Trip, user: User): BookingResult {
  if (!canBookTrip(trip, user)) {
    return { success: false, error: 'Cannot book trip' };
  }

  const finalPrice = calculateDiscountedPrice(trip.basePrice);
  deductUserBalance(user, finalPrice);
  decrementAvailableSeats(trip);
  notifyBookingConfirmation(user, trip);
  trackBookingAnalytics(trip);

  return { success: true };
}
```

### DRY - Don't Repeat Yourself

```typescript
// ❌ MAL - Código duplicado
function formatTripPrice(price: number): string {
  return `$${price.toFixed(2)} USD`;
}

function formatHotelPrice(price: number): string {
  return `$${price.toFixed(2)} USD`;
}

// ✅ BIEN - Reutilización
function formatPrice(amount: number, currency: string = 'USD'): string {
  return `$${amount.toFixed(2)} ${currency}`;
}
```

### Single Responsibility Principle

```typescript
// ❌ MAL - Componente con múltiples responsabilidades
function TripCard({ trip }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const handleFavorite = () => {
    fetch('/api/favorites', { method: 'POST' });
    setIsFavorite(true);
  };

  const handleAddToCart = () => {
    fetch('/api/cart', { method: 'POST' });
    setIsInCart(true);
  };

  return (/* JSX con lógica mezclada */);
}

// ✅ BIEN - Responsabilidades separadas
function TripCard({ trip, onFavorite, onAddToCart }: Props) {
  return (
    <Card>
      <TripImage src={trip.image} alt={trip.title} />
      <TripInfo trip={trip} />
      <TripActions
        onFavorite={onFavorite}
        onAddToCart={onAddToCart}
      />
    </Card>
  );
}
```

---

## �🔒 REGLAS FUNDAMENTALES (NO NEGOCIABLES)

### 1. Stack Tecnológico - USO OBLIGATORIO

```
- Framework: Next.js 15+ con App Router
- Lenguaje: TypeScript (strict mode activado)
- Estilos: Tailwind CSS + shadcn/ui
- Animaciones: Framer Motion
- Testing: Playwright
- Monitoreo: Sentry
- Gestión de Estado: React Hooks nativos
- Package Manager: pnpm (NUNCA npm o yarn)
```

**❌ PROHIBIDO:**

- JavaScript puro (todo debe ser TypeScript)
- Pages Router de Next.js
- CSS Modules o Styled Components
- npm o yarn como package manager
- Librerías de estado global no aprobadas (Redux, Zustand, etc.)

### 2. Estructura de Archivos - CUMPLIMIENTO OBLIGATORIO

```
✅ CORRECTO:
app/                    # Rutas de la aplicación
  [route]/page.tsx     # Páginas dinámicas
  [route]/layout.tsx   # Layouts anidados
  api/                 # API Routes
components/            # Componentes reutilizables
  ui/                  # Componentes shadcn/ui
  skeletons/           # Estados de carga
hooks/                 # Custom hooks
lib/                   # Utilidades y helpers
public/                # Assets estáticos
tests/                 # Tests E2E
```

**❌ NO CREAR:**

- Carpetas `src/`
- Carpetas `pages/` (Pages Router)
- Mezclar componentes UI con lógica de negocio
- Archivos de configuración custom sin autorización

### 3. Convenciones de Código - APLICACIÓN ESTRICTA

#### Nomenclatura Obligatoria

```typescript
// ✅ CORRECTO
// Componentes: PascalCase
export function TripDetailClient() {}

// Archivos de componentes: kebab-case.tsx
// trip-detail-client.tsx

// Funciones: camelCase
function handleTripSelection() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_TRIPS_PER_PAGE = 12;

// Interfaces: PascalCase con prefijo "I" opcional
interface TripData {}
interface IUserPreferences {}

// Types: PascalCase
type FilterOptions = {};

// Hooks: camelCase con prefijo "use"
function useDebounce() {}
```

**❌ PROHIBIDO:**

- snake_case para funciones o variables
- archivos con extensión .js (solo .ts o .tsx)
- nombres genéricos (data, temp, handler sin contexto)

#### Componentes React

```typescript
// ✅ ESTRUCTURA OBLIGATORIA
'use client'; // Solo si usa hooks del cliente

import { useState, useEffect } from 'react';
import type { ComponentType } from './types';

interface ComponentNameProps {
  // Props tipadas SIEMPRE
  title: string;
  onAction: () => void;
  items?: Item[]; // Opcionales con ?
}

export function ComponentName({
  title,
  onAction,
  items = [], // Defaults cuando aplique
}: ComponentNameProps) {
  // 1. Hooks primero
  const [state, setState] = useState<Type>(initialValue);
  const { hook } = useCustomHook();

  // 2. useEffect después
  useEffect(() => {
    // Lógica
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  // 3. Funciones handlers
  const handleClick = () => {
    // Lógica
  };

  // 4. Early returns
  if (!items.length) {
    return <EmptyState />;
  }

  // 5. Render
  return <div className="container mx-auto">{/* JSX */}</div>;
}
```

**❌ PRÁCTICAS PROHIBIDAS:**

```typescript
// NO usar any
const data: any = {}; // ❌

// NO usar function component con function keyword
export default function Component() {} // ❌ (usar export function)

// NO inline styles (usar Tailwind)
<div style={{ color: 'red' }}> // ❌

// NO desestructurar props en el body
export function Component(props) { // ❌
  const { title } = props;
}

// NO hooks condicionales
if (condition) {
  useState(); // ❌
}
```

### 4. Reglas de TypeScript - CUMPLIMIENTO TOTAL

```typescript
// ✅ TIPADO EXPLÍCITO OBLIGATORIO

// Interfaces para objetos y props
interface Trip {
  id: string;
  title: string;
  price: number;
  available: boolean;
}

// Types para uniones y tipos complejos
type Status = 'pending' | 'active' | 'completed';
type TripWithStatus = Trip & { status: Status };

// Genéricos cuando sea necesario
function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}

// Return types explícitos en funciones importantes
function calculateTotal(items: Trip[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Arrays tipados
const trips: Trip[] = [];
const ids: string[] = [];
```

**❌ NUNCA:**

```typescript
// NO usar any
let data: any; // ❌

// NO omitir tipos en parámetros
function process(data) {} // ❌

// NO usar ! (non-null assertion) sin justificación
const value = obj.prop!; // ❌ Solo si es absolutamente seguro

// NO usar @ts-ignore o @ts-nocheck
// @ts-ignore // ❌
const x = undefined.value;
```

### 5. Estilos con Tailwind CSS - REGLAS ESTRICTAS

```tsx
// ✅ OBLIGATORIO

// Usar clases de Tailwind
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// Agrupar clases lógicamente: layout → spacing → colors → effects
<div className="flex flex-col gap-4 p-6 bg-gray-50 hover:bg-gray-100 transition-colors">

// Responsive design con prefijos
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Dark mode cuando aplique
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">

// Usar cn() de utils para clases condicionales
import { cn } from '@/lib/utils';
<div className={cn("base-classes", isActive && "active-classes")}>
```

**❌ PROHIBIDO:**

```tsx
// NO inline styles
<div style={{ display: 'flex' }}> // ❌

// NO CSS modules
import styles from './Component.module.css'; // ❌

// NO clases custom sin justificación
<div className="custom-container"> // ❌

// NO valores arbitrarios sin necesidad
<div className="p-[13px]"> // ❌ Usar p-3 o p-4
```

### 6. Imports - ORDEN OBLIGATORIO

```typescript
// ✅ ORDEN ESTRICTO

// 1. React y Next.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 2. Librerías externas (alfabético)
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

// 3. Componentes internos (alfabético)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TripCard } from '@/components/trip-card';

// 4. Hooks personalizados
import { useDebounce } from '@/hooks/use-debounce';
import { useWishlist } from '@/hooks/use-wishlist';

// 5. Utils y helpers
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/seo-helpers';

// 6. Types (al final o en archivo separado)
import type { Trip } from '@/types';

// Línea en blanco antes del código
```

**❌ NO:**

```typescript
// NO imports relativos profundos
import { Button } from '../../../components/ui/button'; // ❌

// NO mezclar import con require
const module = require('module'); // ❌

// NO import *
import * as React from 'react'; // ❌ (salvo casos específicos)
```

### 7. Server y Client Components - SEPARACIÓN ESTRICTA

```typescript
// ✅ Server Components (por defecto)
// NO incluir 'use client' si no usa hooks del cliente
// app/trips/page.tsx
import { TripGrid } from '@/components/trip-grid';

export default async function TripsPage() {
  // Fetch data directamente
  const trips = await fetchTrips();

  return <TripGrid trips={trips} />;
}

// ✅ Client Components (cuando sea necesario)
// components/trip-grid.tsx
('use client');

import { useState } from 'react';

export function TripGrid({ trips }) {
  const [filters, setFilters] = useState({});
  // Lógica interactiva
}
```

**❌ PROHIBIDO:**

```typescript
// NO 'use client' innecesario
'use client'; // ❌ Si no usa hooks/eventos

// NO async en Client Components
'use client';
export default async function Component() {} // ❌

// NO fetch directo en Client Components
('use client');
export function Component() {
  const data = await fetch(); // ❌ Usar useEffect o Server Component
}
```

### 8. Performance - OPTIMIZACIONES OBLIGATORIAS

```typescript
// ✅ SIEMPRE IMPLEMENTAR

// 1. Next.js Image para imágenes
import Image from 'next/image';
<Image src="/trip.jpg" alt="Descriptive text" width={800} height={600} priority={isAboveTheFold} loading={isAboveTheFold ? undefined : 'lazy'} />;

// 2. Dynamic imports para componentes pesados
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <Skeleton />,
  ssr: false, // Solo si es necesario
});

// 3. Suspense para loading states
import { Suspense } from 'react';
<Suspense fallback={<LoadingSkeleton />}>
  <AsyncComponent />
</Suspense>;

// 4. Memoization cuando sea necesario
import { useMemo, useCallback } from 'react';
const expensiveValue = useMemo(() => computeExpensive(data), [data]);
const handleClick = useCallback(() => {}, [deps]);
```

**❌ ANTI-PATRONES:**

```typescript
// NO <img> tags
<img src="/image.jpg" /> // ❌ Usar Next Image

// NO re-renders innecesarios
<Component onClick={() => handler()} /> // ❌ Usar useCallback

// NO cálculos pesados sin memo
const value = items.filter().map().reduce(); // ❌ En cada render
```

### 9. Manejo de Errores - IMPLEMENTACIÓN OBLIGATORIA

```typescript
// ✅ Error Boundaries (app/error.tsx)
'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Algo salió mal</h2>
      <button onClick={reset}>Reintentar</button>
    </div>
  );
}

// ✅ Try-catch en async operations
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle error appropriately
    throw error;
  }
}

// ✅ Validación de datos
function processTrip(trip: unknown): Trip {
  if (!isValidTrip(trip)) {
    throw new Error('Invalid trip data');
  }
  return trip;
}
```

### 10. Accesibilidad (a11y) - CUMPLIMIENTO OBLIGATORIO

```tsx
// ✅ SIEMPRE INCLUIR

// 1. Alt text en imágenes
<Image src="/trip.jpg" alt="Vista panorámica de Machu Picchu" />

// 2. Labels en inputs
<label htmlFor="search">Buscar viajes</label>
<input id="search" type="text" />

// 3. ARIA attributes cuando sean necesarios
<button
  aria-label="Cerrar menú"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  <X />
</button>

// 4. Navegación por teclado
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  onClick={handleClick}
>

// 5. Semantic HTML
<main>
  <article>
    <header><h1>Título</h1></header>
    <section>Contenido</section>
  </article>
</main>
```

**❌ PROHIBIDO:**

```tsx
// NO divs clickeables sin accesibilidad
<div onClick={handler}>Click me</div> // ❌

// NO imágenes sin alt
<Image src="/img.jpg" /> // ❌

// NO remover outline sin alternativa
<button className="outline-none"> // ❌
```

### 11. Testing - COBERTURA OBLIGATORIA

```typescript
// ✅ Tests E2E con Playwright (tests/)
import { test, expect } from '@playwright/test';

test.describe('Trip Detail Page', () => {
  test('should display trip information', async ({ page }) => {
    await page.goto('/viaje/1');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="trip-price"]')).toContainText('$');
  });

  test('should add trip to wishlist', async ({ page }) => {
    await page.goto('/viaje/1');
    await page.click('[data-testid="wishlist-button"]');
    await expect(page.locator('[data-testid="wishlist-count"]')).toContainText('1');
  });
});

// ✅ Test IDs en componentes importantes
<button data-testid="wishlist-button">Añadir a favoritos</button>;
```

### 12. SEO y Metadata - IMPLEMENTACIÓN OBLIGATORIA

```typescript
// ✅ Metadata en todas las páginas
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Viajes a Machu Picchu | Headway Trips',
  description: 'Descubre los mejores paquetes turísticos a Machu Picchu...',
  keywords: ['viajes', 'Machu Picchu', 'turismo', 'Perú'],
  openGraph: {
    title: 'Viajes a Machu Picchu',
    description: '...',
    images: ['/og-image.jpg'],
  },
};

// ✅ Structured Data (JSON-LD)
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: trip.title,
      // ...
    }),
  }}
/>;
```

### 13. Commits y Documentación - FORMATO OBLIGATORIO

```bash
# ✅ Conventional Commits
feat: add trip comparison functionality
fix: resolve mobile menu scroll lock issue
refactor: optimize trip grid rendering
docs: update API documentation
test: add E2E tests for checkout flow
chore: update dependencies
style: format code with prettier

# ❌ NO commits genéricos
git commit -m "fix stuff" # ❌
git commit -m "update" # ❌
```

### 14. Variables de Entorno y Configuración

```env
# ✅ .env.local (NUNCA commitear)
NEXT_PUBLIC_API_URL=https://api.example.com
SENTRY_DSN=your_sentry_dsn
DATABASE_URL=postgresql://...

# Usar NEXT_PUBLIC_ para variables del cliente
# Sin prefijo para variables del servidor
```

### 15. API Routes - ESTRUCTURA OBLIGATORIA

```typescript
// ✅ app/api/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validación
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Lógica
    const data = await fetchData(id);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ✅ Siempre tipado y con manejo de errores
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validar body
    // Procesar
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
```

---

## 📋 CHECKLIST OBLIGATORIO ANTES DE CADA COMMIT

- [ ] ✅ Todo el código es TypeScript (no .js)
- [ ] ✅ Sin errores de TypeScript en strict mode
- [ ] ✅ Sin console.logs (excepto en manejo de errores)
- [ ] ✅ Todas las imágenes usan Next Image
- [ ] ✅ Todos los links usan Next Link
- [ ] ✅ 'use client' solo donde es necesario
- [ ] ✅ Componentes tienen props tipadas con interface
- [ ] ✅ Funciones importantes tienen return type
- [ ] ✅ No hay 'any' types
- [ ] ✅ Imports ordenados correctamente
- [ ] ✅ Clases Tailwind agrupadas lógicamente
- [ ] ✅ Accesibilidad: alt texts, aria labels, semantic HTML
- [ ] ✅ Loading states con Suspense o Skeleton
- [ ] ✅ Error handling implementado
- [ ] ✅ Responsive design (mobile-first)
- [ ] ✅ Tests E2E actualizados si aplica
- [ ] ✅ Metadata SEO incluida
- [ ] ✅ Sin hardcoded strings (usar constantes)
- [ ] ✅ Code formatted (Prettier)
- [ ] ✅ Commit message sigue Conventional Commits

---

## 🚨 RECORDATORIOS CRÍTICOS

1. **SIEMPRE** TypeScript strict mode
2. **NUNCA** usar 'any' o '@ts-ignore'
3. **SIEMPRE** componentes Server por defecto, Client solo cuando sea necesario
4. **NUNCA** inline styles, siempre Tailwind CSS
5. **SIEMPRE** Next Image para imágenes, Next Link para links
6. **NUNCA** fetch directo en Client Components
7. **SIEMPRE** tipado explícito en props y funciones importantes
8. **NUNCA** npm o yarn, solo pnpm
9. **SIEMPRE** imports con alias @ (no relativos profundos)
10. **NUNCA** commitear sin pasar el checklist

---

## 🎯 FILOSOFÍA DEL PROYECTO

> "Código limpio, tipado fuerte, rendimiento óptimo, accesibilidad total"

- **Prioridad 1:** Type Safety
- **Prioridad 2:** Performance
- **Prioridad 3:** Accesibilidad
- **Prioridad 4:** Developer Experience
- **Prioridad 5:** Mantenibilidad

**Estas instrucciones son ESTRICTAS y NO NEGOCIABLES. Cualquier código que no cumpla con estas reglas debe ser rechazado y refactorizado.**
