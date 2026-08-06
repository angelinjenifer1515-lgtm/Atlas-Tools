# Atlas Tools

A beautifully crafted collection of online utilities — hundreds of browser-based tools, free and instant, with no sign-ups required.

## Stack

- **TanStack Start** (SSR-capable React meta-framework)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Vite 8** (dev server)
- **Bun** (package manager & runtime)

## Running the app

```sh
bun run dev
```

The dev server starts on **port 5000**. On Replit this is handled automatically by the **Start application** workflow.

## Project structure

```
src/
  routes/        # File-based routing (TanStack Router)
  components/
    atlas/       # Page sections (Nav, Hero, Categories, etc.)
    ui/          # shadcn/ui primitives
  hooks/         # Custom React hooks
  lib/           # Shared utilities
  server.ts      # SSR middleware wrapper
  start.ts       # TanStack Start entry point
  styles.css     # Global styles (Tailwind)
```

## Notes

- Originally built with [Lovable](https://lovable.dev); imported to Replit for further development.
- `vite.config.ts` uses `@lovable.dev/vite-tanstack-config` — the `vite.server` overrides in that file are required for Replit's preview proxy (port 5000, `host: true`, `allowedHosts: true`).
- No external secrets or databases required to run.

## User preferences

_(Add any preferences here as you work with Replit Agent.)_
