# Mapa de entrega — Frontend

| Exigência do enunciado | Atendido em |
|---|---|
| §4.1 Painel do Operador | `src/componentes/painel-operador/painel-operador.tsx` + `src/lib/ganchos/use-simulacao.ts` |
| §4.2 Grid de Transações | `src/componentes/grid-transacoes/grid-transacoes.tsx` + `src/lib/ganchos/use-transacoes.ts` |
| §4.3 Arquitetura de Front | `src/lib/api.ts` (camada única), ESLint proíbe `fetch` em componentes, separação por funcionalidade |
| ADR-016 Proxy mesma origem | `next.config.ts` |
| ADR-013 Next.js 16 + TS 5.9.3 | `package.json` (versões fixadas) |
| Testes | `vitest.config.ts` + `src/componentes/painel-operador/painel-operador.test.tsx` |
| E2E | `playwright.config.ts` (estrutura preparada) |
| CI | `.github/workflows/ci.yml` |
| Documentação | `README.md`, `AI_USAGE.md`, este mapa |

## Fora de escopo

- **Autenticação** — não consta no enunciado.
- **Estado global** (Zustand/Redux) — `searchParams` da URL é o estado de listagem, suficiente.
- **Cálculo local da fórmula** — proibido; a única implementação é no backend.
