# AI_USAGE — Frontend

## Prompts estratégicos

- "Como proxyar a API de um backend no Next.js 16 sem CORS?" → levou a `rewrites()` em `next.config.ts` lendo `API_INTERNAL_URL` no servidor.
- "Como validar contrato de resposta HTTP no boundary com TypeScript?" → levou a `zod` + `parse()` na camada `api.ts`.
- "Como sincronizar paginação e filtros do grid com a URL em Next.js 16?" → levou a `useSearchParams` + `router.push`.

## Alucinações corrigidas

- **TypeScript 7 com Next.js 16**: o `@types/react` mais recente parecia compatível, mas `typescript@latest` quebra a detecção. Fixado em `5.9.3`.
- **`fetch` em Server Components**: sugerido para a camada de dados, mas quebraria a separação cliente/servidor e o proxy. Mantida a camada `api.ts` no cliente.
- **Tailwind 4 com `@apply`**: a config canônica é `@import "tailwindcss"` em CSS, não nas classes.

## Onde a IA ajudou

- Estruturação por funcionalidade (`componentes/painel-operador/`, `componentes/grid-transacoes/`).
- Hooks de debounce e descarte de resposta obsoleta.
- Esquemas Zod com `string` para valores monetários.

## Onde a IA atrapalhou

- Sugeriu criar um store global (Zustand) para o estado da listagem. Não é necessário — `searchParams` da URL já é o estado.
- Sugeriu cálculo local da fórmula para latência zero. Proibido pelo design (precisão decimal só no backend).
