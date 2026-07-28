// src/lib/api.ts — única camada de acesso à API. Tudo relativo à origem
// do frontend; o Next reescreve para o backend (ADR-016).
// Nenhum componente importa fetch diretamente: o lint proíbe.

export type Resposta<T> = { dados: T; correlation_id?: string };

async function chamar<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  const resp = await fetch(caminho, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Correlation-ID": crypto.randomUUID(),
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
