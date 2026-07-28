import { test, expect } from "@playwright/test";

// Fluxo completo do painel do operador: simulação em tempo real seguida da
// confirmação da operação (POST /api/v1/transacoes). Assume a stack Docker
// Compose (frontend + backend + banco) já no ar — ver README.
test.describe("Painel do operador", () => {
  test("simula uma operação e confirma a transação", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel(/valor de face/i).fill("10000.00");
    await page.getByLabel(/vencimento/i).fill("2026-12-15");
    await page.getByLabel(/tipo de recebível/i).selectOption("DUPLICATA_MERCANTIL");
    await page.getByLabel(/moeda do título/i).selectOption("BRL");
    await page.getByLabel(/moeda de pagamento/i).selectOption("BRL");

    // O estado neutro deve dar lugar a um resultado (não precisa validar o
    // número exato, apenas que a simulação foi concluída com sucesso).
    await expect(page.getByText(/preencha os campos para simular/i)).toHaveCount(0, {
      timeout: 10_000,
    });
    await expect(page.getByText(/erro/i)).toHaveCount(0);
    await expect(page.getByText(/valor líquido/i)).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: /confirmar operação/i }).click();

    const confirmacao = page.getByText(/transação confirmada\. id:/i);
    await expect(confirmacao).toBeVisible({ timeout: 10_000 });
    await expect(confirmacao).not.toBeEmpty();
  });
});
