# SRM Credit Engine — Frontend

App Next.js 16 que consome a API do backend por proxy de mesma origem. Stack fixa: Next.js 16.2.12, React 19.2.8, TypeScript 5.9.3, TanStack Query 5.101.4, Zod 4.4.3, Tailwind 4.3.3, Vitest 4.1.10, Playwright 1.62.0.

## Pré-requisitos

- Bun 1.3.14
- Backend em execução em `http://localhost:8080` (ou via Docker Compose)

## Execução local

```bash
bun install
API_INTERNAL_URL=http://localhost:8080 bun run dev
```

A aplicação sobe em `http://localhost:3000`. As requisições a `/api/*` são reescritas pelo Next para `${API_INTERNAL_URL}/api/*` — o browser fala apenas com a origem do frontend.

## Execução com Docker

```bash
docker compose -f ../srm-backend/docker-compose.yml up -d db api carga
docker build -t srm-frontend . && docker run -p 3000:3000 -e API_INTERNAL_URL=http://host.docker.internal:8080 srm-frontend
```

## Comandos

```bash
bun run dev          # dev server
bun run build        # build de produção
bun run start        # serve build de produção
bun run lint         # ESLint
bun run type-check   # tsc --noEmit
bun run test         # vitest
bun run test:e2e     # Playwright contra a stack em execução
```

## Estrutura

```
src/
  app/                # App Router do Next.js
  componentes/        # componentes por funcionalidade
    painel-operador/
    grid-transacoes/
  lib/
    api.ts            # única camada de acesso à API
    esquemas.ts       # Zod
    ganchos/          # hooks de dados (TanStack Query)
    provedor-query.tsx
```

## Camada de API

Todo acesso à API passa por `src/lib/api.ts`. Componentes de apresentação **não** importam `fetch` — o lint proíbe. O caminho no browser é sempre relativo à própria origem.

## Documentação adicional

- `AI_USAGE.md`
- `docs/mapa-de-entrega.md`
