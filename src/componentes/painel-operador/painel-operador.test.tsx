import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/ganchos/use-tipos-recebivel", () => ({
  useTiposRecebivel: () => ({
    data: [
      { codigo: "DUPLICATA_MERCANTIL", nome: "Duplicata Mercantil" },
      { codigo: "CHEQUE_PRE_DATADO", nome: "Cheque Pré-datado" },
    ],
  }),
}));

import { PainelOperador } from "@/componentes/painel-operador/painel-operador";

describe("PainelOperador", () => {
  it("renderiza campos e mostra estado neutro sem chamar a API", () => {
    render(<PainelOperador />);
    expect(screen.getByLabelText(/valor de face/i)).toBeInTheDocument();
    expect(screen.getByText(/preencha os campos para simular/i)).toBeInTheDocument();
  });

  it("permite editar o valor de face", async () => {
    const user = userEvent.setup();
    render(<PainelOperador />);
    const input = screen.getByLabelText(/valor de face/i) as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "5000.00");
    expect(input.value).toBe("5000.00");
  });
});
