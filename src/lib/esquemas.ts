import { z } from "zod";

export const EsquemaSimulacao = z.object({
  cedente_id: z.number().int().positive(),
  tipo_recebivel: z.string().min(1),
  valor_face: z.string().regex(/^\d+(\.\d+)?$/),
  moeda_titulo: z.string().length(3),
  moeda_pagamento: z.string().length(3),
  data_vencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_operacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const EsquemaRespostaSimulacao = z.object({
  valor_presente: z.string(),
  valor_liquido: z.string(),
  desagio: z.string(),
  moeda_titulo: z.string(),
  moeda_pagamento: z.string(),
  data_operacao: z.string(),
  data_vencimento: z.string(),
});

export const EsquemaTipoRecebivel = z.object({
  codigo: z.string(),
  nome: z.string(),
});

export const EsquemaRespostaTransacao = z.object({
  id: z.string(),
  status: z.enum(["PENDENTE", "LIQUIDADA", "CANCELADA"]),
  versao: z.number().int(),
  valor_face: z.string(),
  valor_presente: z.string(),
  valor_liquido: z.string(),
  desagio: z.string(),
  moeda_titulo: z.string(),
  moeda_pagamento: z.string(),
  data_operacao: z.string(),
  data_vencimento: z.string(),
  liquidada_em: z.string().nullable().optional(),
  created_at: z.string(),
});

export const EsquemaLinhaExtrato = EsquemaRespostaTransacao.extend({
  cedente_nome: z.string(),
  cedente_documento: z.string(),
  tipo_recebivel: z.string(),
});

export const EsquemaPaginada = z.object({
  total: z.number(),
  pagina: z.number(),
  tamanho: z.number(),
  total_paginas: z.number(),
  items: z.array(EsquemaLinhaExtrato),
});
