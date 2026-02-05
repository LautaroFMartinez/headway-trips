# Changelog

Registro de cambios importantes del proyecto.

---

## [2026-02-05] - Emails React Email + Dashboard mejorado + Fixes de tipos

### Emails transaccionales con React Email

Se migraron todos los templates de email a React Email para mejor mantenibilidad y consistencia visual.

**Archivos nuevos:**
- `lib/email-templates/components/email-layout.tsx` - Layout base reutilizable con header, footer y estilos de marca
- `lib/email-templates/QuoteCustomerConfirmation.tsx` - Confirmacion al cliente cuando pide cotizacion
- `lib/email-templates/QuoteAdminNotification.tsx` - Notificacion al admin con datos del cliente
- `lib/email-templates/ContactCustomerConfirmation.tsx` - Confirmacion al cliente cuando envia mensaje
- `lib/email-templates/ContactAdminNotification.tsx` - Notificacion al admin con el mensaje

**Archivos modificados:**
- `lib/email-templates/index.ts` - Reescrito para usar `render()` de `@react-email/render`. Las funciones ahora son async.

**Archivos eliminados:**
- `lib/email-templates/quote-customer-confirmation.ts`
- `lib/email-templates/quote-admin-notification.ts`
- `lib/email-templates/contact-customer-confirmation.ts`
- `lib/email-templates/contact-admin-notification.ts`

**Cambios en consumidores:**
- `app/api/quotes/route.ts` - Adaptado para manejar promesas al renderizar emails
- `app/api/contact/route.ts` - Mismo cambio

Los emails mantienen la misma funcionalidad pero ahora usan componentes React que son mas faciles de modificar y testear.

---

### Dashboard de metricas mejorado

Se cambio el dashboard del admin para mostrar datos mas utiles.

**Cambios principales:**

1. **Rango de tiempo:** De 7 dias a 28 dias (4 semanas)
2. **Agregacion:** Datos agrupados por semana en lugar de por dia
3. **Nuevos KPIs:**
   - "Ventas cerradas" - cotizaciones con status `confirmed`
   - "Contactadas sin cierre" - cotizaciones con status `contacted`
4. **Nuevo grafico:** Barras comparando confirmadas vs contactadas por semana

**Archivos modificados:**
- `app/api/admin/dashboard/route.ts` - Logica de 28 dias, buckets semanales, nuevos campos en respuesta
- `components/admin/dashboard-content.tsx` - Nuevas tarjetas KPI, grafico de conversion, skeleton actualizado

---

### Fixes de tipos TypeScript

Habia errores de tipos que impedian compilar correctamente.

**Problema 1: Columnas faltantes en tipos de Supabase**

La tabla `trips` tenia columnas que no estaban en `database.types.ts`:
- `gallery` (array de URLs de imagenes)
- `content_blocks` (JSON con bloques de contenido)
- `pdf_url` (URL del PDF generado)

**Solucion:** Se agregaron las 3 columnas a Row, Insert y Update en `lib/database.types.ts`.

**Problema 2: Casting de ContentBlock[]**

En `components/proposal/ProposalPage.tsx`, los arrays filtrados de `contentBlocks` no matcheaban con los tipos esperados por los componentes hijos.

**Solucion:** Se agregaron casts explicitos:
```typescript
const textBlocks = (...) as TextBlock[];
const accommodationBlocks = (...) as AccommodationBlock[];
```

**Problema 3: Cast de JSON a ContentBlock[]**

En `app/viaje/[id]/page.tsx`, el campo `content_blocks` viene como `Json` de Supabase y no se podia castear directo a `ContentBlock[]`.

**Solucion:** Cast intermedio a `unknown`:
```typescript
(data.content_blocks as unknown as ContentBlock[])
```

---

### Archivos tocados en esta sesion

```
lib/email-templates/components/email-layout.tsx  (nuevo)
lib/email-templates/QuoteCustomerConfirmation.tsx  (nuevo)
lib/email-templates/QuoteAdminNotification.tsx  (nuevo)
lib/email-templates/ContactCustomerConfirmation.tsx  (nuevo)
lib/email-templates/ContactAdminNotification.tsx  (nuevo)
lib/email-templates/index.ts  (reescrito)
app/api/quotes/route.ts  (modificado)
app/api/contact/route.ts  (modificado)
app/api/admin/dashboard/route.ts  (reescrito)
components/admin/dashboard-content.tsx  (reescrito)
lib/database.types.ts  (modificado - 3 columnas agregadas)
components/proposal/ProposalPage.tsx  (modificado - casts de tipos)
app/viaje/[id]/page.tsx  (modificado - cast de content_blocks)
```

---

### Notas para el proximo que toque esto

- Si agregas columnas a la base de datos, acuerdate de actualizar `lib/database.types.ts` o correr `supabase gen types typescript` de nuevo.
- Los emails usan `@react-email/components` - podes verlos en el browser con `npx email dev` si instalas `@react-email/render` en dev.
- El dashboard busca datos de los ultimos 28 dias. Si la base esta vacia muestra datos de demo.
