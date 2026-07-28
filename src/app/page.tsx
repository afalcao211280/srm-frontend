import { PainelOperador } from "@/componentes/painel-operador/painel-operador";
import { GridTransacoes } from "@/componentes/grid-transacoes/grid-transacoes";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">SRM Credit Engine</h1>
      <PainelOperador />
      <GridTransacoes />
    </main>
  );
}
