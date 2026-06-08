# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

E-commerce de moda deportiva de lujo ("quiet luxury") con arquitectura **headless commerce**.
El frontend Next.js 15 (App Router) consume un Storefront API externo (AWS API Gateway + Lambda) a través de un proxy server-side, desplegado en AWS Amplify.

El código del frontend vive en: `ethra-sport-nextjs/`

---

## Comandos

Todos los comandos se ejecutan desde `ethra-sport-nextjs/`:

```bash
npm run dev      # Servidor de desarrollo (localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción local
npm run lint     # ESLint
```

**Variables de entorno requeridas** (`.env.local`):
```
STOREFRONT_API_URL=https://7bwnj6nhve.execute-api.us-east-2.amazonaws.com/default/jmrg-stock/api/v1/storefront
TENANT_API_KEY=<clave del tenant>
```

Sin estas variables el build falla (validación explícita en `amplify.yml`).

---

## Arquitectura

```
Browser → AWS Amplify (Next.js SSR) → /api/storefront/[...path] (Proxy BFF) → Storefront API
                                                                                      ↓
                                                               S3 → CloudFront (imágenes)
```

### Flujo de datos: server vs. client

- **Server Components / SSR**: llaman `storefrontFetch()` directamente — inyecta `STOREFRONT_API_URL` + `TENANT_API_KEY` (env de servidor)
- **Client Components**: pasan por el proxy `/api/storefront/[...path]/route.ts` que inyecta `X-Tenant-Key` — las credenciales nunca se exponen al browser
- `lib/storefront/client.ts` detecta automáticamente el entorno con `typeof window !== "undefined"` y elige la ruta correcta
- `storefrontFetch()` siempre usa `cache: "no-store"` — no hay caching implícito de fetch; el caching lo maneja React Query en el cliente

### Capas

| Directorio | Responsabilidad |
|------------|----------------|
| `app/` | Páginas y rutas (App Router) |
| `app/api/storefront/[...path]/` | Proxy BFF — inyecta `X-Tenant-Key`, protege credenciales |
| `components/ethra/` | Componentes de negocio (UI del dominio Ethra) |
| `components/ui/` | Primitivos shadcn/ui (Radix UI) |
| `components/providers/` | `QueryProvider.tsx` — wraps la app con TanStack Query |
| `lib/storefront/` | Capa de acceso al API (client, api, queries, types, format, variants, actions) |
| `hooks/` | `use-mobile.tsx`, `useInfiniteScroll.ts` |

---

## Módulos clave en `lib/storefront/`

| Archivo | Rol |
|---------|-----|
| `client.ts` | `storefrontFetch<T>()` — HTTP client universal. Lanza `StorefrontApiError` en respuestas no-2xx |
| `api.ts` | Funciones tipadas por endpoint (`getCategories`, `getCatalog`, `getProduct`, etc.) |
| `queries.ts` | Factories de `queryOptions` para React Query (cache keys, staleTime) |
| `types.ts` | Contratos TypeScript del API (`Product`, `Category`, `Variant`, etc.) |
| `format.ts` | Formateo de precios (MXN), resolución de imágenes CDN, sort |
| `variants.ts` | Parser de variantes: `parseProductVariants()`, `getVariantDisplayPrice()`, `getDefaultVariantSelection()` |
| `actions.ts` | Server Actions para mutations desde RSC |

**`StorefrontApiError`** (en `client.ts`): clase custom con `status: number` y `data?: unknown` — úsala en catch para distinguir errores de API de errores de red.

---

## Endpoints del Storefront API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/categories` | Categorías con subcategorías |
| GET | `/catalog?page=&limit=&categoryId=` | Catálogo paginado |
| GET | `/catalog/search?q=&limit=` | Búsqueda de productos |
| GET | `/catalog/:productId` | Detalle de producto |
| GET | `/categories/:categoryId/products?page=&limit=` | Productos por categoría |
| GET | `/store-info` | Información de la tienda |

---

## Patrones de rendering

| Página | Estrategia | Detalle |
|--------|-----------|---------|
| `/` | SSR `force-dynamic` | Catálogo fresco |
| `/catalogo` | SSR | Search params: `?q=`, `?page=`, `?categoryId=` — soporta búsqueda y filtro por categoría |
| `/colecciones` | SSR | SEO + datos iniciales |
| `/colecciones/[categoryId]` | SSR + hydration cliente | Primera página SSR, infinite scroll con `useInfiniteQuery` |
| `/producto/[productId]` | SSR | SEO + metadata dinámica |
| `/filosofia` | Static | Contenido estático de marca |

---

## Imágenes

- Almacenadas en S3: `app-imagenes-stock-ecommerce.s3.us-east-2.amazonaws.com`
- Servidas por CDN: `dvt8oixa5wj3m.cloudfront.net`
- `lib/cdn.ts` → `toCdnImageUrl()` reescribe URLs S3 → CDN automáticamente
- `lib/brand.ts` → `ETHRA_BRAND` contiene el logo URL (apunta al CDN) y datos de la marca
- `next.config.ts` permite ambos hostnames en `images.remotePatterns`

---

## Sistema de diseño

**Paleta Ethra** (Tailwind CSS v4 con OKLCH):

| Token | Uso |
|-------|-----|
| `ethra-bone` | Fondo principal |
| `ethra-cream` | Fondo secundario |
| `ethra-stone` | Texto muted |
| `ethra-black` | Texto principal |
| `ethra-charcoal` | Texto secundario |
| `ethra-gold` | Acentos premium |
| `ethra-sand` | Elementos decorativos |

**Tipografía**: Playfair Display (headings) · Montserrat (display) · Inter (body)

---

## Lo que NO está implementado aún

- Carrito de compras
- Autenticación de usuarios (login/registro)
- Checkout y pagos
- Tests (sin configuración de testing)
- i18n (hardcoded en español / MXN)

---

## Infra AWS

- **Hosting**: AWS Amplify (us-east-2) — SSR con Next.js
- **API**: API Gateway + Lambda → `https://7bwnj6nhve.execute-api.us-east-2.amazonaws.com`
- **CDN imágenes**: CloudFront `dvt8oixa5wj3m.cloudfront.net`
- **Deploy**: `amplify.yml` — `npm ci` → validar env vars → generar `.env.production` → `npm run build`
