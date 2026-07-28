"use client";

import { useState } from "react";

import { useSimulacao } from "@/lib/ganchos/use-simulacao";
import { useTiposRecebivel } from "@/lib/ganchos/use-tipos-recebivel";

export function PainelOperador() {
  const tipos = useTiposRecebivel();
  const [form, setForm] = useState({
    cedente_id: 1,
    tipo_recebivel: "DUPLICATA_MERCANTIL",
    valor_face: "10000.00",
    moeda_titulo: "BRL",
    moeda_pagamento: "BRL",
    data_vencimento: "2026-08-15",
  });
  const habilitado =
    form.valor_face !== "" && form.data_vencimento !== "" && form.tipo_recebivel !== "";
  const estado = useSimulacao({ entrada: form, habilitado });

  return (
    <section className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Simulação</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Campo label="Valor de face (BRL)">
          <input
            type="text"
            value={form.valor_face}
            onChange={(e) => setForm({ ...form, valor_face: e.target.value })}
            className="rounded border px-3 py-2"
          />
        </Campo>
        <Campo label="Vencimento">
          <input
            type="date"
            value={form.data_vencimento}
            onChange={(e) => setForm({ ...form, data_vencimento: e.target.value })}
            className="rounded border px-3 py-2"
          />
        </Campo>
        <Campo label="Tipo de recebível">
          <select
            value={form.tipo_recebivel}
            onChange={(e) => setForm({ ...form, tipo_recebivel: e.target.value })}
            className="rounded border px-3 py-2"
          >
            {(tipos.data ?? []).map((t) => (
              <option key={t.codigo} value={t.codigo}>
                {t.nome}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Moeda do título">
          <select
            value={form.moeda_titulo}
            onChange={(e) => setForm({ ...form, moeda_titulo: e.target.value })}
            className="rounded border px-3 py-2"
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
          </select>
        </Campo>
        <Campo label="Moeda de pagamento">
          <select
            value={form.moeda_pagamento}
            onChange={(e) => setForm({ ...form, moeda_pagamento: e.target.value })}
            className="rounded border px-3 py-2"
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
          </select>
        </Campo>
      </div>
      <div className="mt-6 rounded bg-slate-50 p-4">
        {estado.tipo === "ocioso" && <span className="text-slate-500">Preencha os campos para simular.</span>}
        {estado.tipo === "carregando" && <span>Calculando…</span>}
        {estado.tipo === "erro" && <span className="text-red-600">{estado.mensagem}</span>}
        {estado.tipo === "sucesso" && (
          <dl className="grid grid-cols-3 gap-4">
            <div>
              <dt className="text-sm text-slate-500">Valor presente</dt>
              <dd className="text-lg font-mono">{estado.dados.valor_presente}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Deságio</dt>
              <dd className="text-lg font-mono">{estado.dados.desagio}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Valor líquido ({estado.dados.moeda_pagamento})</dt>
              <dd className="text-lg font-mono">{estado.dados.valor_liquido}</dd>
            </div>
          </dl>
        )}
      </div>
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
