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

// Schema próprio, não estendido de EsquemaRespostaTransacao: o extrato é
// uma camada de relatório separada no backend (internal/report, 2 camadas,
// sem hidratar entidade de domínio) — sua projeção SQL nunca incluiu
// created_at/updated_at, só o que a tela precisa. Herdar do schema
// transacional fazia o parse rejeitar toda resposta real do endpoint.
export const EsquemaLinhaExtrato = z.object({
  id: z.string(),
  data_operacao: z.string(),
  data_vencimento: z.string(),
  cedente_nome: z.string(),
  cedente_documento: z.string(),
  tipo_recebivel: z.string(),
  moeda_titulo: z.string(),
  moeda_pagamento: z.string(),
  valor_face: z.string(),
  valor_presente: z.string(),
  valor_liquido: z.string(),
  desagio: z.string(),
  spread_aplicado: z.string(),
  taxa_base_aplicada: z.string(),
  cotacao_aplicada: z.string().nullable().optional(),
  status: z.enum(["PENDENTE", "LIQUIDADA", "CANCELADA"]),
  versao: z.number().int(),
  liquidada_em: z.string().nullable().optional(),
});

export const EsquemaPaginada = z.object({
  total: z.number(),
  pagina: z.number(),
  tamanho: z.number(),
  total_paginas: z.number(),
  items: z.array(EsquemaLinhaExtrato),
});
