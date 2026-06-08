# Arquitectura del Sistema — Ethra Sport Commerce

## Visión General

Ethra Sport Commerce es una plataforma e-commerce de moda deportiva de lujo ("quiet luxury") construida con una arquitectura **headless commerce**. El frontend Next.js consume un API de Storefront externo a través de un proxy server-side, desplegado en AWS Amplify.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USUARIO (Browser)                                  │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AWS AMPLIFY (Hosting + SSR)                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    NEXT.JS 15 (App Router)                             │  │
│  │                                                                        │  │
│  │  ┌─────────────┐   ┌──────────────────┐   ┌───────────────────────┐  │  │
│  │  │ Server      │   │  API Route       │   │  Client Components    │  │  │
│  │  │ Components  │──▶│  /api/storefront  │◀──│  (React Query)        │  │  │
│  │  │ (SSR)       │   │  [Proxy]          │   │                       │  │  │
│  │  └──────┬──────┘   └────────┬─────────┘   └───────────────────────┘  │  │
│  │         │                    │                                         │  │
│  └─────────┼────────────────────┼─────────────────────────────────────────┘  │
└────────────┼────────────────────┼────────────────────────────────────────────┘
             │                    │
             ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              STOREFRONT API (API Gateway + Lambda)                            │
│     https://7bwnj6nhve.execute-api.us-east-2.amazonaws.com                   │
│     /default/jmrg-stock/api/v1/storefront                                    │
│                                                                              │
│  Autenticación: X-Tenant-Key header (multi-tenant)                           │
└─────────────────────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AWS INFRASTRUCTURE                                     │
│                                                                              │
│  ┌───────────────────┐       ┌──────────────────────────────────────────┐   │
│  │   S3 Bucket       │       │   CloudFront CDN                          │   │
│  │   (Imágenes)      │──────▶│   dvt8oixa5wj3m.cloudfront.net           │   │
│  │   us-east-2       │       │   (Distribución de imágenes)              │   │
│  └───────────────────┘       └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 15.3.x |
| Runtime | React | 19.2.x |
| Lenguaje | TypeScript | 5.8.x |
| Estilos | Tailwind CSS v4 | 4.2.x |
| Animaciones | Framer Motion | 12.38.x |
| Estado servidor | TanStack React Query | 5.83.x |
| Formularios | React Hook Form + Zod | 7.71.x / 3.24.x |
| UI primitivos | Radix UI | Múltiples |
| Gráficos | Recharts | 2.15.x |
| Hosting | AWS Amplify | — |
| CDN imágenes | AWS CloudFront | — |
| API backend | AWS API Gateway + Lambda | — |

---

## Estructura de Directorios

```
ethra-sport-nextjs/
├── app/                          # App Router (páginas y rutas)
│   ├── layout.tsx                # Layout raíz (metadata, fonts)
│   ├── page.tsx                  # Homepage (SSR)
│   ├── globals.css               # Sistema de diseño (Tailwind + tokens)
│   ├── error.tsx                 # Error boundary global
│   ├── not-found.tsx             # Página 404
│   ├── api/
│   │   └── storefront/[...path]/ # Proxy API (catch-all route)
│   │       └── route.ts
│   ├── catalogo/                 # Catálogo general de productos
│   ├── colecciones/              # Navegación por categorías
│   │   ├── page.tsx
│   │   └── [categoryId]/         # Productos por categoría (dinámico)
│   ├── producto/[productId]/     # Detalle de producto (dinámico)
│   └── filosofia/                # Página institucional de marca
│
├── components/
│   ├── ethra/                    # Componentes de negocio (dominio)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardGallery.tsx
│   │   ├── ProductDetailView.tsx
│   │   ├── CatalogGridProductCard.tsx
│   │   ├── CategoryCatalogNav.tsx
│   │   ├── CategoryCatalogToolbar.tsx
│   │   ├── ShopLayout.tsx
│   │   ├── NuevasFormas.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FilosofiaContent.tsx
│   │   ├── EthraLogo.tsx
│   │   └── StorefrontError.tsx
│   ├── providers/
│   │   └── QueryProvider.tsx     # TanStack Query provider
│   └── ui/
│       └── select.tsx            # Componentes shadcn/ui
│
├── lib/                          # Lógica de negocio y utilidades
│   ├── brand.ts                  # Constantes de marca (logo, nombre)
│   ├── cdn.ts                    # Utilidad de reescritura de URLs S3→CDN
│   ├── utils.ts                  # Utilidades generales
│   └── storefront/               # Capa de acceso al API
│       ├── client.ts             # HTTP client (fetch + tenant auth)
│       ├── api.ts                # Funciones de API (endpoints)
│       ├── queries.ts            # React Query options factories
│       ├── types.ts              # Tipos TypeScript del storefront
│       ├── format.ts             # Formateo (precios, categorías, sort)
│       ├── variants.ts           # Parser de variantes (color/talla)
│       └── actions.ts            # Server Actions (RSC mutations)
│
├── hooks/
│   ├── use-mobile.tsx            # Detección de viewport móvil
│   └── useInfiniteScroll.ts      # Infinite scroll con IntersectionObserver
│
├── public/                       # Assets estáticos (vacío — CDN externo)
├── amplify.yml                   # Pipeline de build AWS Amplify
├── next.config.ts                # Config Next.js (image domains)
├── tsconfig.json                 # TypeScript config
└── postcss.config.mjs            # PostCSS (Tailwind v4)
```

---

## Arquitectura por Capas

### 1. Capa de Presentación (UI)

- **Componentes de dominio** (`components/ethra/`): Implementan la UI específica de Ethra Sport con estética "quiet luxury"
- **Componentes UI base** (`components/ui/`): Primitivos de shadcn/ui basados en Radix UI
- **Sistema de diseño**: Tailwind CSS v4 con tokens de color propios (bone, cream, stone, gold, charcoal)
- **Tipografía**: Playfair Display (headings), Montserrat (display), Inter (body)

### 2. Capa de Estado (Data Fetching)

```
┌─────────────────────────────────────────────┐
│         Estrategia de Data Fetching          │
├─────────────────────────────────────────────┤
│                                              │
│  SERVER SIDE (SSR)         CLIENT SIDE       │
│  ─────────────────         ────────────      │
│  • Homepage                • Infinite scroll │
│  • Colecciones             • Búsqueda        │
│  • Detalle producto        • Filtros/Sort    │
│  • Categorías                                │
│                                              │
│  ┌──────────────┐    ┌──────────────────┐   │
│  │ Direct fetch │    │ TanStack Query   │   │
│  │ (server)     │    │ (useQuery,       │   │
│  │              │    │  useInfiniteQuery)│   │
│  └──────────────┘    └──────────────────┘   │
│         │                      │             │
│         ▼                      ▼             │
│  ┌─────────────────────────────────────┐    │
│  │     storefrontFetch() — client.ts    │    │
│  │     (detección auto server/browser)  │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

- **Server-side**: Los Server Components llaman directamente al API externo con `STOREFRONT_API_URL` + `TENANT_API_KEY`
- **Client-side**: Los Client Components pasan por el proxy `/api/storefront/[...path]` para ocultar las credenciales

### 3. Capa de Proxy API

El catch-all route `/api/storefront/[...path]/route.ts` actúa como **BFF (Backend for Frontend)**:

- Inyecta el header `X-Tenant-Key` en cada request
- Soporta todos los métodos HTTP (GET, POST, PUT, PATCH, DELETE)
- Protege las credenciales del tenant (nunca expuestas al browser)
- Streaming de response body sin buffering

### 4. Capa de Dominio (lib/storefront/)

| Módulo | Responsabilidad |
|--------|----------------|
| `client.ts` | HTTP client universal (SSR directo, CSR vía proxy) |
| `api.ts` | Funciones tipadas por endpoint (getCategories, getCatalog, etc.) |
| `queries.ts` | Factories de queryOptions para React Query (cache keys, staleTime) |
| `types.ts` | Contratos TypeScript del API (Product, Category, Variant, etc.) |
| `format.ts` | Formateo de precios (MXN), resolución de imágenes, sort |
| `variants.ts` | Parser inteligente de variantes (color/talla con disponibilidad) |
| `actions.ts` | Server Actions para mutations desde RSC |

---

## Endpoints del Storefront API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/categories` | Lista de categorías con subcategorías |
| GET | `/catalog?page=&limit=&categoryId=` | Catálogo paginado |
| GET | `/catalog/search?q=&limit=` | Búsqueda de productos |
| GET | `/catalog/:productId` | Detalle de producto |
| GET | `/categories/:categoryId/products?page=&limit=` | Productos por categoría |
| GET | `/store-info` | Información de la tienda |

---

## Multi-Tenancy

El sistema es **multi-tenant** — cada tienda se identifica mediante un `TENANT_API_KEY`:

```
Request → Next.js Proxy → Header: X-Tenant-Key: tk_live_xxx → Storefront API
```

Esto permite que el mismo backend sirva múltiples tiendas (marcas) con datos aislados.

---

## Infraestructura AWS

```
┌─────────────────────────────────────────────────────┐
│                  AWS us-east-2                        │
│                                                      │
│  ┌────────────────┐     ┌────────────────────────┐  │
│  │  AWS Amplify   │     │  API Gateway           │  │
│  │  (Next.js SSR) │────▶│  + Lambda Functions     │  │
│  │  Build + Host  │     │  (Storefront API)       │  │
│  └────────────────┘     └────────────────────────┘  │
│                                                      │
│  ┌────────────────┐     ┌────────────────────────┐  │
│  │  S3 Bucket     │     │  CloudFront            │  │
│  │  (Imágenes     │────▶│  dvt8oixa5wj3m         │  │
│  │   de stock)    │     │  .cloudfront.net        │  │
│  └────────────────┘     └────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Pipeline de Deploy (amplify.yml)

1. `npm ci` — Instalar dependencias
2. Validar variables de entorno (`STOREFRONT_API_URL`, `TENANT_API_KEY`)
3. Generar `.env.production` dinámicamente
4. `npm run build` — Build Next.js
5. Deploy artefactos `.next/` con cache de `node_modules` y `.next/cache`

---

## Sistema de Imágenes

Las imágenes de productos se almacenan en S3 y se sirven vía CloudFront:

```
S3: app-imagenes-stock-ecommerce.s3.us-east-2.amazonaws.com
CDN: dvt8oixa5wj3m.cloudfront.net
```

La función `toCdnImageUrl()` en `lib/cdn.ts` reescribe automáticamente URLs de S3 al CDN, mejorando latencia y costos.

---

## Sistema de Diseño

### Paleta de Colores (Ethra Brand)

| Token | Valor OKLCH | Uso |
|-------|-------------|-----|
| `ethra-bone` | oklch(0.982 0.005 85) | Fondo principal |
| `ethra-cream` | oklch(0.955 0.012 75) | Fondo secundario |
| `ethra-stone` | oklch(0.665 0.008 80) | Texto muted |
| `ethra-black` | oklch(0.18 0.003 80) | Texto principal |
| `ethra-charcoal` | oklch(0.28 0.003 80) | Texto secundario |
| `ethra-gold` | oklch(0.66 0.105 80) | Acentos premium |
| `ethra-sand` | oklch(0.79 0.06 75) | Elementos decorativos |

### Tipografía

- **Serif** (headings): Playfair Display — elegancia editorial
- **Display** (subtítulos): Montserrat — modernidad limpia
- **Sans** (body): Inter — legibilidad óptima

---

## Patrones de Rendering

| Página | Estrategia | Razón |
|--------|-----------|-------|
| Homepage (`/`) | SSR (`force-dynamic`) | Contenido fresco del catálogo |
| Colecciones (`/colecciones`) | SSR | SEO + datos iniciales |
| Categoría (`/colecciones/[id]`) | SSR + Client hydration | Initial data + infinite scroll |
| Producto (`/producto/[id]`) | SSR | SEO + metadata dinámica |
| Filosofía (`/filosofia`) | Static | Contenido estático de marca |

---

## Flujo de Datos — Ejemplo: Página de Categoría

```
1. Browser GET /colecciones/[categoryId]
       │
2.     ▼ Next.js Server Component
       ├── getCategories() ──────────▶ Storefront API /categories
       └── getCategoryProducts() ───▶ Storefront API /categories/:id/products?page=1
       │
3.     ▼ Render HTML con datos iniciales
       │  (SSR — primera página de productos)
       │
4.     ▼ Browser hydration
       │  CategoryProductsContent (Client Component)
       │  └── useInfiniteQuery (React Query)
       │      └── IntersectionObserver (infinite scroll)
       │          └── fetchNextPage() ──▶ /api/storefront/categories/:id/products?page=N
       │                                       │
5.                                             ▼ Proxy Route
                                               └── Storefront API (con X-Tenant-Key)
```

---

## Gestión de Variantes de Producto

El sistema maneja variantes con un parser inteligente (`lib/storefront/variants.ts`):

- **Colores**: Detectados por atributos con `hex` + `name`
- **Tallas**: Detectadas por atributos tipo string con patrón `/talla|size/`
- **Disponibilidad**: Validación cruzada color×talla con stock > 0
- **Precio**: Override por variante (fijo o por objeto `{amount, currency}`)
- **Orden de tallas**: XXS → XXXL (orden estándar de confección)

---

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `STOREFRONT_API_URL` | URL base del API de storefront | Sí |
| `TENANT_API_KEY` | Clave de autenticación del tenant | Sí |

---

## Dependencias Clave y sus Roles

| Paquete | Rol en el Sistema |
|---------|-------------------|
| `@tanstack/react-query` | Cache, revalidación y estado del servidor |
| `framer-motion` | Animaciones de entrada y transiciones |
| `radix-ui/*` | Primitivos accesibles (dialog, select, tabs, etc.) |
| `react-hook-form` + `zod` | Validación de formularios |
| `embla-carousel-react` | Carousel de imágenes de producto |
| `recharts` | Gráficos (analytics futuro) |
| `sonner` | Notificaciones toast |
| `vaul` | Drawer/bottom sheet móvil |
| `lucide-react` | Sistema de íconos |
| `date-fns` | Formateo de fechas |

---

## Consideraciones de Arquitectura

### Fortalezas
- **Headless commerce**: Desacoplamiento total frontend/backend
- **Multi-tenant ready**: Infraestructura preparada para múltiples marcas
- **SEO optimizado**: SSR en todas las páginas de catálogo
- **Performance**: CDN para imágenes, React Query para cache inteligente
- **Type-safe**: TypeScript end-to-end con tipos del API

### Áreas de Crecimiento
- **Carrito de compras**: No implementado aún (solo catálogo)
- **Autenticación de usuarios**: Sin sistema de login/registro
- **Checkout/Pagos**: Pendiente de integración
- **Admin panel**: Gestión vía backend externo (jmrg-stock)
- **Testing**: Sin tests configurados actualmente
- **i18n**: Hardcoded en español (MXN)
