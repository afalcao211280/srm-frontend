"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import { useTransacoes } from "@/lib/ganchos/use-transacoes";

export function GridTransacoes() {
  const search = useSearchParams();
  const router = useRouter();
  const pagina = Number(search.get("pagina") ?? "1");
  const tamanho = Number(search.get("tamanho") ?? "20");
  const moeda = search.get("moeda") ?? undefined;
  const status = search.get("status") ?? undefined;

  const opcoes = useMemo(() => ({ pagina, tamanho, moeda, status }), [pagina, tamanho, moeda, status]);
  const query = useTransacoes(opcoes);

  const irPara = (p: number) => {
    const u = new URLSearchParams(search.toString());
    u.set("pagina", String(p));
    router.push(`?${u.toString()}`);
  };

  return (
    <section className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Transações</h2>
      {query.isLoading && <p>Carregando…</p>}
      {query.isError && <p className="text-red-600">Erro ao carregar transações.</p>}
      {query.data && query.data.items.length === 0 && <p className="text-slate-500">Nenhum registro.</p>}
      {query.data && query.data.items.length > 0 && (
        <>
          <table className="w-full text-left">
            <thead className="border-b text-sm text-slate-500">
              <tr>
                <th>ID</th>
                <th>Operação</th>
                <th>Cedente</th>
                <th>Tipo</th>
                <th>Valor líquido</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {query.data.items.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="font-mono text-xs">{t.id.slice(0, 8)}</td>
                  <td>{t.data_operacao}</td>
                  <td>{t.cedente_nome}</td>
                  <td>{t.tipo_recebivel}</td>
                  <td className="font-mono">{t.valor_liquido} {t.moeda_pagamento}</td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>
              Página {query.data.pagina} de {query.data.total_paginas} ({query.data.total} registros)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => irPara(Math.max(1, pagina - 1))}
                disabled={pagina <= 1}
                className="rounded border px-3 py-1 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={() => irPara(pagina + 1)}
                disabled={pagina >= query.data.total_paginas}
                className="rounded border px-3 py-1 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
