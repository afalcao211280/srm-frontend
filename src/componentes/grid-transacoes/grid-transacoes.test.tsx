import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mockPush = vi.fn();
const mockUseTransacoes = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/ganchos/use-tipos-recebivel", () => ({
  useTiposRecebivel: () => ({
    data: [
      { codigo: "DUPLICATA_MERCANTIL", nome: "Duplicata Mercantil" },
      { codigo: "CHEQUE_PRE_DATADO", nome: "Cheque Pré-datado" },
    ],
  }),
}));

vi.mock("@/lib/ganchos/use-transacoes", () => ({
  useTransacoes: () => mockUseTransacoes(),
}));

import { GridTransacoes } from "@/componentes/grid-transacoes/grid-transacoes";

const linhaBase = {
  status: "PENDENTE" as const,
  versao: 1,
  valor_face: "1000.00",
  valor_presente: "950.00",
  valor_liquido: "940.00",
  desagio: "10.00",
  moeda_titulo: "BRL",
  moeda_pagamento: "BRL",
  data_operacao: "2026-07-01",
  data_vencimento: "2026-08-01",
  created_at: "2026-07-01T00:00:00Z",
  cedente_documento: "00000000000191",
};

describe("GridTransacoes", () => {
  it("renderiza as linhas retornadas pela busca", () => {
    mockUseTransacoes.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        total: 2,
        pagina: 1,
        tamanho: 20,
        total_paginas: 1,
        items: [
          { ...linhaBase, id: "id-1", cedente_nome: "Cedente A", tipo_recebivel: "DUPLICATA_MERCANTIL" },
          {
            ...linhaBase,
            id: "id-2",
            status: "LIQUIDADA",
            cedente_nome: "Cedente B",
            tipo_recebivel: "CHEQUE_PRE_DATADO",
          },
        ],
      },
    });

    render(<GridTransacoes />);

    expect(screen.getByText("Cedente A")).toBeInTheDocument();
    expect(screen.getByText("Cedente B")).toBeInTheDocument();
    expect(screen.getByText("DUPLICATA_MERCANTIL")).toBeInTheDocument();
    expect(screen.getByText("CHEQUE_PRE_DATADO")).toBeInTheDocument();
  });

  it("mostra o estado vazio quando não há registros", () => {
    mockUseTransacoes.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { total: 0, pagina: 1, tamanho: 20, total_paginas: 0, items: [] },
    });

    render(<GridTransacoes />);

    expect(screen.getByText(/nenhum registro/i)).toBeInTheDocument();
  });

  it("mostra o estado de erro quando a busca falha", () => {
    mockUseTransacoes.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
    });

    render(<GridTransacoes />);

    expect(screen.getByText(/erro ao carregar transações/i)).toBeInTheDocument();
  });
});
