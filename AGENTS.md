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
