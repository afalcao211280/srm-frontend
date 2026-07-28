import { defineConfig, devices } from "@playwright/test";

// Specs assumem a stack Docker Compose (frontend + backend + banco) já no ar.
// Não sobe o Next automaticamente — ver README para como rodar a stack.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
