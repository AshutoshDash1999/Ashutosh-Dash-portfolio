# AGENTS.md - Codebase Guide for Agentic Coding

This document provides guidelines for agentic coding assistants working in this repository.

---

## Project Overview

This is Ashutosh Dash's portfolio website - a fast, modern, and responsive Next.js 16 + React 19 application using the App Router.

**Tech Stack:**
- Framework: Next.js 16 (App Router)
- UI: React 19 with TypeScript (strict mode)
- Styling: Tailwind CSS 4 + OKLCH color system
- Components: Radix UI + shadcn/ui patterns (new-york style)
- Animations: Motion (Framer Motion alternative)
- Linting/Formatting: Biome 2.2

---

## Design Context

This portfolio targets **hiring managers, recruiters, and potential clients** evaluating for employment, contracting, or collaboration. Visitors scan quickly—clarity and impact matter immediately.

**Brand Personality:** Professional, reliable, technical—with playful edge. Inspire confidence in technical depth while standing out through personality.

**Aesthetic Direction:** Playful, bold, and clean. Inspired by neobrutalism (strong geometry, unpolished charm, irreverent details) and modern energetic design (API World landing page). Embrace bold color and shape while maintaining clarity. Avoid minimalist or corporate sterile feel.

**Visual References:**
- https://dribbble.com/shots/18786007-API-World-landing-page — energetic layout, clear hierarchy, modern boldness
- https://www.neobrutalism.dev/ — raw geometry, thick borders, playful rule-breaking, anti-polish charm

**Design Principles:**

1. **Bold with purpose** — Use strong colors, thick elements, and geometric shapes. Every visual accent should communicate or delight, not decorate.

2. **Scannable hierarchy** — Recruiters skim. Sections must be immediately distinguishable; copy concise; key info (skills, experience, projects) stand out without reading everything.

3. **Playful reliability** — Professional credentials (clean typography, WCAG AA compliance, smooth interactions) paired with personality (unexpected animations, color plays, irreverent details). Technical people hiring technical people—show you're both competent and interesting.

4. **Light and dark parity** — Both themes equally intentional. Dark mode isn't afterthought; colors, contrast, feel should be considered for both. Purple accent stays consistent.

5. **Interaction = delight** — Smooth transitions, purposeful animations, micro-interactions. But never slow or precious—respect user time. View Transitions API + Framer Motion should feel like the site responding to you, not showing off.

**Accessibility:** WCAG AA minimum. Ensure sufficient color contrast in both themes, keyboard navigable, alt text for images, semantic HTML. Reduce motion should degrade gracefully, not break animations.

**Color:** Keep current purple OKLch scheme as primary accent—it works across light/dark. Lean into contrast and saturation for boldness without changing the foundation. Consider where solid color blocks or strong borders can reinforce neo-brutalist aesthetic.

---

## Build Commands

```bash
# Development
npm run dev          # Start Next.js dev server on localhost:3000

# Production
npm run build        # Create optimized production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run Biome linter (check only)
npm run format       # Format code with Biome (writes changes)
npm run knip         # Check for unused dependencies/exports
```

**No test suite exists** - this is a static portfolio site. Focus on lint/type checks instead.

---

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - no implicit any, strict null checks
- Use explicit return types for exported functions
- Prefer `type` over `interface` for object shapes unless you need merging
- Use `import type` for type-only imports

```typescript
// Good
import type { SomeType } from "@/lib/types";
export function processData(data: SomeType): ResultType { ... }

// Bad
import { SomeType } from "@/lib/types";
function processData(data) { ... }
```

### Imports

**Path aliases** (defined in tsconfig.json):
- `@/*` → `./src/*`
- `@/components` → `./src/components`
- `@/lib` → `./src/lib`
- `@/hooks` → `./src/hooks`
- `@/components/ui` → `./src/components/ui`

**Import order** (Biome auto-organizes):
1. React/next imports
2. Third-party imports (Radix, Lucide, etc.)
3. Internal imports (@/lib, @/components)
4. CSS imports

```typescript
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import "./styles.css";
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `HeroSection`, `StatCards` |
| Functions | camelCase | `useTrackEvent`, `successResponse` |
| Variables | camelCase | `siteUrl`, `coverImage` |
| Constants | camelCase | `THIRTY_DAYS` (all caps for true constants) |
| Types/Interfaces | PascalCase | `ApiResponse`, `VariantProps` |
| CSS classes | kebab-case | `bg-main`, `text-foreground` |
| Files (components) | PascalCase | `button.tsx`, `hero-section.tsx` |
| Files (utilities) | kebab-case | `use-track-event.ts`, `api-utils.ts` |

### React Patterns

**Client vs Server Components:**
- Default to Server Components (no "use client" directive)
- Add `"use client"` only when hooks/state/interactivity needed
- Keep client boundaries minimal

**Component Structure:**
```typescript
// 1. Imports
import React from "react";
import { someUtil } from "@/lib/utils";

// 2. Type definitions (if needed)
interface ComponentProps {
  title: string;
  variant?: "default" | "primary";
}

// 3. Component definition
export function Component({ title, variant = "default" }: ComponentProps) {
  // Hooks (if client component)
  // Early returns
  // Main logic
  // Render

  return <div>{title}</div>;
}

// 4. Named exports (prefer over default for utilities)
export { helperFunction };
```

### Tailwind CSS Patterns

- **CSS Variables** for theme tokens (defined in globals.css):
  - `--main`, `--background`, `--foreground`, `--border`, `--ring`
  - `--chart-1` through `--chart-10`
  - `--shadow` (box-shadow value)
  - `--radius-base`

- **Utility classes**: Use Tailwind's `@apply` sparingly; prefer inline classes
- **Dark mode**: Use `dark:` prefix with `class` strategy (`dark` class on html element)
- **Custom properties**: Access via `var(--name)` in CSS or as Tailwind classes like `bg-main`

### Error Handling

**API Routes** use standardized responses (see `src/lib/api/response.ts`):

```typescript
import { successResponse, errors } from "@/lib/api/response";

// Success
return successResponse({ data: "value" });

// Error helpers
return errors.notFound("Stats data");
return errors.badRequest("Invalid date range");
return errors.internalError();
```

**Client-side fetches** use SWR with the `fetcher` utility:

```typescript
import { fetcher } from "@/lib/api/hooks/fetcher";

const { data } = useSWR("/api/stats", fetcher);
```

---

## File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (route.ts files)
│   │   └── stats/
│   │       └── route.ts   # GET handler exported
│   ├── insights/          # Route segments with layouts
│   │   ├── _components/  # Segmented components (private)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Tailwind + theme CSS
├── components/
│   ├── ui/                # shadcn/ui-style primitives
│   ├── sections/          # Page sections (Hero, Footer, etc.)
│   ├── layout/            # Layout components
│   └── providers/          # Context providers
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities, API helpers, types
    └── api/
        ├── hooks/         # SWR hooks
        ├── response.ts    # Response helpers
        └── types.ts       # Shared types
```

---

## Configuration Files

| File | Purpose |
|------|---------|
| `biome.json` | Linting/formatting rules (2-space indent, import org) |
| `tsconfig.json` | TypeScript config (strict mode, path aliases) |
| `next.config.ts` | Next.js config (React Compiler enabled) |
| `components.json` | shadcn/ui config (new-york style, lucide icons) |
| `knip.jsonc` | Dependency unused detection |

---

## Key Conventions

1. **No tests** - Portfolio site with no test suite; rely on lint/type checks
2. **React Compiler** - Babel plugin enabled in next.config.ts; don't disable
3. **View Transitions** - Next.js View Transitions API used for page navigation
4. **OKLCH colors** - Use oklch() for all theme colors in CSS
5. **Box shadows** - Custom shadow pattern with offset shadows (neobrutalism style)
6. **No console.log** - Use PostHog analytics instead for tracking

---

## Common Patterns

### Creating a New UI Component

```bash
# Components go in src/components/ui/
# Use cva (class-variance-authority) for variants
# Export both component and variants
```

### Adding a New API Route

```typescript
// src/app/api/feature/route.ts
import { successResponse, errors } from "@/lib/api/response";

export async function GET() {
  try {
    const data = await fetchData();
    return successResponse(data);
  } catch {
    return errors.internalError();
  }
}
```

### Adding a New Page

```typescript
// src/app/new-page/page.tsx
// Server component by default
// Add "use client" only if interactivity needed

export const metadata = { title: "Page Title" };

export default function NewPage() {
  return <main>Content</main>;
}
```

---

## Linting Before Commit

Always run before committing:

```bash
npm run lint
```

Biome will catch: unused variables, missing keys in arrays, incorrect imports, React hooks rules, and more.

---

*Last updated: 2026-04-06*

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-fetching-data.mdx,07-mutating-data.mdx,08-caching.mdx,09-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{ai-agents.mdx,analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching-without-cache-components.mdx,cdn-caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,deploying-to-platforms.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,how-revalidation-works.mdx,incremental-static-regeneration.mdx,instant-navigation.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,migrating-to-cache-components.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,ppr-platform-guide.mdx,prefetching.mdx,preserving-ui-state.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,rendering-philosophy.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,streaming.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx,view-transitions.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions/02-route-segment-config:{dynamicParams.mdx,instant.mdx,maxDuration.mdx,preferredRegion.mdx,runtime.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,catchError.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,turbopackIgnoreIssue.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|01-app/03-api-reference/07-adapters:{01-configuration.mdx,02-creating-an-adapter.mdx,03-api-reference.mdx,04-testing-adapters.mdx,05-routing-with-next-routing.mdx,06-implementing-ppr-in-an-adapter.mdx,07-runtime-integration.mdx,08-invoking-entrypoints.mdx,09-output-types.mdx,10-routing-information.mdx,11-use-cases.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,logging.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|02-pages/04-api-reference/06-adapters:{01-configuration.mdx,02-creating-an-adapter.mdx,03-api-reference.mdx,04-testing-adapters.mdx,05-routing-with-next-routing.mdx,06-implementing-ppr-in-an-adapter.mdx,07-runtime-integration.mdx,08-invoking-entrypoints.mdx,09-output-types.mdx,10-routing-information.mdx,11-use-cases.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
