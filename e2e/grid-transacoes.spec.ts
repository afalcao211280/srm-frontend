import { test, expect } from "@playwright/test";

// Filtros e paginação do grid de transações vivem inteiramente na URL
// (searchParams), aplicados no servidor via querystring. Assume a stack
// Docker Compose (frontend + backend + banco) já no ar — ver README.
test.describe("Grid de transações", () => {
  test("aplica filtro de moeda e pagina os resultados via URL", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel(/^moeda$/i).selectOption("BRL");

    await expect(page).toHaveURL(/[?&]moeda=BRL/);
    await expect(page).toHaveURL(/[?&]pagina=1/);

    const botaoProxima = page.getByRole("button", { name: /próxima/i });
    await expect(botaoProxima).toBeVisible({ timeout: 10_000 });

    if (await botaoProxima.isEnabled()) {
      await botaoProxima.click();
      await expect(page).toHaveURL(/[?&]pagina=2/);
    }
  });
});
