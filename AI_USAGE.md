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

## Lacunas reveladas pela auditoria

Uma auditoria posterior rodou o toolchain pela primeira vez (`bun install` nunca tinha sido executado neste repositório) e encontrou tasks marcadas como concluídas que na prática eram stubs, apontavam para o lugar errado ou nunca tinham sido verificadas:

- **Hook do grid no endpoint errado**: `use-transacoes.ts` chamava `GET /api/v1/transacoes` (listagem simples, sem joins), mas `grid-transacoes.tsx` e os esquemas Zod (`EsquemaLinhaExtrato`) já esperavam `cedente_nome`, `cedente_documento` e `tipo_recebivel` — campos que só existem em `GET /api/v1/relatorios/extrato-liquidacao`. Divergência de contrato silenciosa entre o que a UI esperava e o que a API antiga retornava; só ficaria visível em runtime contra o backend real.
- **Playwright documentado como "preparado" mas inexistente**: `docs/mapa-de-entrega.md` afirmava "estrutura preparada" para E2E, mas não havia `playwright.config.ts` nem `e2e/` no repositório.
- **`lefthook` configurado mas nunca instalado**: `lefthook.yml` já existia e estava correto, mas `lefthook` não constava no `package.json` — os hooks nunca rodavam.
- **Toolchain nunca executado de ponta a ponta**: ao rodar `bun install` + lint/type-check/test/build pela primeira vez, apareceram vários problemas que não tinham como ser pegos por leitura de código: `use-simulacao.ts` e `use-tipos-recebivel.ts` importavam `./api`/`./esquemas` com caminho relativo errado (deveriam ser `../api`/`../esquemas`, já que esses hooks vivem em `lib/ganchos/` e os módulos em `lib/`) — erro de compilação puro; `@testing-library/user-event`, `jsdom` e `@tanstack/react-query-devtools` eram usados no código mas nunca entraram no `package.json`; `eslint@10.8.0` (fixado no `package.json` original) é incompatível com `eslint-plugin-react` (dependência do `eslint-config-next`, que trava em `eslint@^9.7` — não há build compatível com ESLint 10 publicado); faltava `@vitejs/plugin-react` e um `setupFiles` no `vitest.config.ts`, então nenhum teste de componente rodava; e `GridTransacoes` usa `useSearchParams()` sem estar dentro de um `<Suspense>`, o que quebra `next build` (bailout de renderização estática). Nenhum desses problemas apareceria numa revisão só de leitura de código — só rodando os comandos de verificação de fato.
