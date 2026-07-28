"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "./api";
import { EsquemaTipoRecebivel } from "./esquemas";

export function useTiposRecebivel() {
  return useQuery({
    queryKey: ["tipos-recebivel"],
    queryFn: async () => {
      const resp = await api.get<{ items: unknown }>("/api/v1/tipos-recebivel");
      return EsquemaTipoRecebivel.array().parse(resp.items);
    },
  });
}
