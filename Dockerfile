# Etapas de build: deps → build → runtime
FROM oven/bun:1.3.14-alpine AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app
# rewrites() do next.config.ts é resolvido em build-time e congelado no
# routes-manifest.json do output standalone — setar API_INTERNAL_URL só em
# runtime (docker-compose environment:) não tem efeito, precisa chegar aqui.
ARG API_INTERNAL_URL=http://localhost:8080
ENV API_INTERNAL_URL=$API_INTERNAL_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nonroot
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
# Imagem distroless: sem shell/curl, então HEALTHCHECK precisa do binário
# exato do node (o ENTRYPOINT da imagem base) e do fetch nativo do Node 22.
HEALTHCHECK --interval=10s --retries=3 --start-period=15s \
  CMD ["/nodejs/bin/node", "-e", "fetch('http://localhost:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["server.js"]
