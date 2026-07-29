import { test, expect } from "@playwright/test";

// Fluxo completo do painel do operador: simulação em tempo real seguida da
// confirmação da operação (POST /api/v1/transacoes). Assume a stack Docker
// Compose (frontend + backend + banco) já no ar — ver README.
test.describe("Painel do operador", () => {
  test("simula uma operação e confirma a transação", async ({ page }) => {
    await page.goto("/");

    // A página renderiza o painel ("Simulação") e o grid ("Transações") na
    // mesma tela, e ambos têm um campo "Tipo de recebível" — getByLabel sem
    // escopo bate nos dois (strict mode violation). O accessible name de
    // cada <select> também incorpora o texto da option selecionada (ex.:
    // "Moeda" + "Todas" = "MoedaTodas" no filtro do grid), então escopar
    // pela section evita colisão com os campos "Moeda do título"/"Moeda de
    // pagamento" do painel também.
    const painel = page.locator("section", { hasText: "Simulação" });

    await painel.getByLabel(/valor de face/i).fill("10000.00");
    await painel.getByLabel(/vencimento/i).fill("2026-12-15");
    await painel.getByLabel(/tipo de recebível/i).selectOption("DUPLICATA_MERCANTIL");
    await painel.getByLabel(/moeda do título/i).selectOption("BRL");
    await painel.getByLabel(/moeda de pagamento/i).selectOption("BRL");

    // O estado neutro deve dar lugar a um resultado (não precisa validar o
    // número exato, apenas que a simulação foi concluída com sucesso).
    await expect(painel.getByText(/preencha os campos para simular/i)).toHaveCount(0, {
      timeout: 10_000,
    });
    await expect(painel.getByText(/erro/i)).toHaveCount(0);
    await expect(painel.getByText(/valor líquido/i)).toBeVisible({ timeout: 10_000 });

    await painel.getByRole("button", { name: /confirmar operação/i }).click();

    const confirmacao = painel.getByText(/transação confirmada\. id:/i);
    await expect(confirmacao).toBeVisible({ timeout: 10_000 });
    await expect(confirmacao).not.toBeEmpty();
  });
});
