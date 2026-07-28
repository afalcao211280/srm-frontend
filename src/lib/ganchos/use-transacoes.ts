"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "../api";
import { EsquemaPaginada } from "../esquemas";

type Opcoes = {
  pagina: number;
  tamanho: number;
  moeda?: string;
  status?: string;
  dataInicial?: string;
  dataFinal?: string;
  tipoRecebivel?: string;
  cedenteId?: string;
};

export function useTransacoes(opcoes: Opcoes) {
  return useQuery({
    queryKey: ["transacoes", opcoes],
    queryFn: async () => {
      const busca = new URLSearchParams();
      busca.set("pagina", String(opcoes.pagina));
      busca.set("tamanho", String(opcoes.tamanho));
      if (opcoes.moeda) busca.set("moeda", opcoes.moeda);
      if (opcoes.status) busca.set("status", opcoes.status);
      if (opcoes.dataInicial) busca.set("data_inicial", opcoes.dataInicial);
      if (opcoes.dataFinal) busca.set("data_final", opcoes.dataFinal);
      if (opcoes.tipoRecebivel) busca.set("tipo_recebivel", opcoes.tipoRecebivel);
      if (opcoes.cedenteId) busca.set("cedente_id", opcoes.cedenteId);
      const resp = await api.get<unknown>(`/api/v1/relatorios/extrato-liquidacao?${busca.toString()}`);
      return EsquemaPaginada.parse(resp);
    },
  });
}
