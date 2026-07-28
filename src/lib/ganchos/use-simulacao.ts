"use client";

import { useEffect, useRef, useState } from "react";

import { api } from "./api";
import { EsquemaRespostaSimulacao, EsquemaSimulacao } from "./esquemas";

type Opcoes = {
  entrada: EsquemaSimulacao;
  habilitado: boolean;
  atrasoMs?: number;
};

type Estado =
  | { tipo: "ocioso" }
  | { tipo: "carregando" }
  | { tipo: "sucesso"; dados: import("./esquemas").z.infer<typeof EsquemaRespostaSimulacao> }
  | { tipo: "erro"; mensagem: string };

export function useSimulacao({ entrada, habilitado, atrasoMs = 300 }: Opcoes) {
  const [estado, setEstado] = useState<Estado>({ tipo: "ocioso" });
  const requisicaoRef = useRef(0);

  useEffect(() => {
    if (!habilitado) {
      setEstado({ tipo: "ocioso" });
      return;
    }
    const minhaRequisicao = ++requisicaoRef.current;
    const timer = setTimeout(async () => {
      setEstado({ tipo: "carregando" });
      try {
        const parseada = EsquemaSimulacao.parse(entrada);
        const resp = await api.post<unknown>("/api/v1/simulacoes", parseada);
        if (minhaRequisicao !== requisicaoRef.current) return;
        setEstado({ tipo: "sucesso", dados: EsquemaRespostaSimulacao.parse(resp) });
      } catch (e) {
        if (minhaRequisicao !== requisicaoRef.current) return;
        setEstado({ tipo: "erro", mensagem: e instanceof Error ? e.message : "Erro" });
      }
    }, atrasoMs);
    return () => clearTimeout(timer);
  }, [JSON.stringify(entrada), habilitado, atrasoMs]);

  return estado;
}
