import type { Metadata } from "next";

import { ProvedorQuery } from "@/lib/provedor-query";
import "./globals.css";

export const metadata: Metadata = {
  title: "SRM Credit Engine",
  description: "Plataforma de cessão de crédito multimoedas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ProvedorQuery>{children}</ProvedorQuery>
      </body>
    </html>
  );
}
