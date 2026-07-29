import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockPush = vi.fn();
const mockUseTransacoes = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
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
  useTransacoes: (opcoes: unknown) => mockUseTransacoes(opcoes),
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
  beforeEach(() => {
    mockPush.mockClear();
    mockUseTransacoes.mockClear();
    mockSearchParams = new URLSearchParams();
  });

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

  it("aplica filtro e refaz a busca com os parâmetros corretos", async () => {
    const user = userEvent.setup();
    mockUseTransacoes.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { total: 0, pagina: 1, tamanho: 20, total_paginas: 0, items: [] },
    });

    const { rerender } = render(<GridTransacoes />);

    await user.selectOptions(screen.getByLabelText(/moeda/i), "USD");

    expect(mockPush).toHaveBeenCalledTimes(1);
    const [querystring] = mockPush.mock.calls[0] ?? [];
    const urlAposFiltro = new URLSearchParams((querystring ?? "").replace(/^\?/, ""));
    expect(urlAposFiltro.get("moeda")).toBe("USD");

    // O Next.js real atualiza a URL e re-renderiza com os novos searchParams;
    // aqui simulamos essa navegação para verificar que a busca é refeita.
    mockSearchParams = urlAposFiltro;
    rerender(<GridTransacoes />);

    expect(mockUseTransacoes).toHaveBeenLastCalledWith(
      expect.objectContaining({ pagina: 1, moeda: "USD" }),
    );
  });

  it("retorna para a primeira página ao mudar um filtro", async () => {
    const user = userEvent.setup();
    mockSearchParams = new URLSearchParams("pagina=2");
    mockUseTransacoes.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { total: 0, pagina: 2, tamanho: 20, total_paginas: 3, items: [] },
    });

    render(<GridTransacoes />);

    await user.selectOptions(screen.getByLabelText(/status/i), "LIQUIDADA");

    expect(mockPush).toHaveBeenCalledTimes(1);
    const [querystring] = mockPush.mock.calls[0] ?? [];
    const urlAposFiltro = new URLSearchParams((querystring ?? "").replace(/^\?/, ""));
    expect(urlAposFiltro.get("status")).toBe("LIQUIDADA");
    expect(urlAposFiltro.get("pagina")).toBe("1");
  });

  it("restaura filtros e página a partir dos parâmetros da URL", () => {
    mockSearchParams = new URLSearchParams("pagina=2&moeda=USD&cedente_id=42");
    mockUseTransacoes.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { total: 0, pagina: 2, tamanho: 20, total_paginas: 2, items: [] },
    });

    render(<GridTransacoes />);

    expect(mockUseTransacoes).toHaveBeenLastCalledWith(
      expect.objectContaining({ pagina: 2, moeda: "USD", cedenteId: "42" }),
    );
    expect(screen.getByLabelText(/moeda/i)).toHaveValue("USD");
    expect(screen.getByLabelText(/cedente/i)).toHaveValue(42);
  });
});
