"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import { useTransacoes } from "@/lib/ganchos/use-transacoes";
import { useTiposRecebivel } from "@/lib/ganchos/use-tipos-recebivel";

export function GridTransacoes() {
  const search = useSearchParams();
  const router = useRouter();
  const tipos = useTiposRecebivel();
  const pagina = Number(search.get("pagina") ?? "1");
  const tamanho = Number(search.get("tamanho") ?? "20");
  const moeda = search.get("moeda") ?? undefined;
  const status = search.get("status") ?? undefined;
  const dataInicial = search.get("data_inicial") ?? undefined;
  const dataFinal = search.get("data_final") ?? undefined;
  const tipoRecebivel = search.get("tipo_recebivel") ?? undefined;
  const cedenteId = search.get("cedente_id") ?? undefined;

  const opcoes = useMemo(
    () => ({ pagina, tamanho, moeda, status, dataInicial, dataFinal, tipoRecebivel, cedenteId }),
    [pagina, tamanho, moeda, status, dataInicial, dataFinal, tipoRecebivel, cedenteId],
  );
  const query = useTransacoes(opcoes);

  const irPara = (p: number) => {
    const u = new URLSearchParams(search.toString());
    u.set("pagina", String(p));
    router.push(`?${u.toString()}`);
  };

  const atualizarFiltro = (chave: string, valor: string) => {
    const u = new URLSearchParams(search.toString());
    if (valor) {
      u.set(chave, valor);
    } else {
      u.delete(chave);
    }
    u.set("pagina", "1");
    router.push(`?${u.toString()}`);
  };

  return (
    <section className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Transações</h2>
      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Campo label="Data inicial">
          <input
            type="date"
            value={dataInicial ?? ""}
            onChange={(e) => atualizarFiltro("data_inicial", e.target.value)}
            className="rounded border px-3 py-2"
          />
        </Campo>
        <Campo label="Data final">
          <input
            type="date"
            value={dataFinal ?? ""}
            onChange={(e) => atualizarFiltro("data_final", e.target.value)}
            className="rounded border px-3 py-2"
          />
        </Campo>
        <Campo label="Moeda">
          <select
            value={moeda ?? ""}
            onChange={(e) => atualizarFiltro("moeda", e.target.value)}
            className="rounded border px-3 py-2"
          >
            <option value="">Todas</option>
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
          </select>
        </Campo>
        <Campo label="Tipo de recebível">
          <select
            value={tipoRecebivel ?? ""}
            onChange={(e) => atualizarFiltro("tipo_recebivel", e.target.value)}
            className="rounded border px-3 py-2"
          >
            <option value="">Todos</option>
            {(tipos.data ?? []).map((t) => (
              <option key={t.codigo} value={t.codigo}>
                {t.nome}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Status">
          <select
            value={status ?? ""}
            onChange={(e) => atualizarFiltro("status", e.target.value)}
            className="rounded border px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="LIQUIDADA">Liquidada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </Campo>
        <Campo label="Cedente (ID)">
          <input
            type="number"
            value={cedenteId ?? ""}
            onChange={(e) => atualizarFiltro("cedente_id", e.target.value)}
            className="rounded border px-3 py-2"
          />
        </Campo>
      </div>
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

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
