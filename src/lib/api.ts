// src/lib/api.ts — única camada de acesso à API. Tudo relativo à origem
// do frontend; o Next reescreve para o backend (ADR-016).
// Nenhum componente importa fetch diretamente: o lint proíbe.

export type Resposta<T> = { dados: T; correlation_id?: string };

// crypto.randomUUID só existe em contexto seguro (HTTPS ou "localhost") —
// em qualquer outro host servido por HTTP puro (ex.: acesso direto pelo
// nome do serviço numa rede Docker) o browser nem expõe a função, e a
// chamada quebraria toda requisição. Não é valor criptográfico, só um
// correlation ID de rastreamento — Math.random é suficiente como fallback.
function gerarCorrelationId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function chamar<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  const resp = await fetch(caminho, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Correlation-ID": gerarCorrelationId(),
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!resp.ok) {
    const corpo = await resp.json().catch(() => ({}));
    throw new APIError(resp.status, corpo);
  }
  return resp.json() as Promise<T>;
}

export class APIError extends Error {
  constructor(public status: number, public corpo: { codigo?: string; mensagem?: string; campos?: { campo: string; motivo: string }[] }) {
    super(corpo.mensagem ?? `HTTP ${status}`);
  }
}

export const api = {
  get: <T>(caminho: string) => chamar<T>(caminho),
  post: <T>(caminho: string, body: unknown) =>
    chamar<T>(caminho, { method: "POST", body: JSON.stringify(body) }),
};
