import { listarAutores } from "@/lib/api";
import TablaAutores from "@/components/dashboard/autores/TablaAutores";

export default async function DashboardAutoresPage() {
  const autores = await listarAutores();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Autores</h1>
        <p className="mt-2 text-muted">{autores.length} en total</p>
      </div>

      <TablaAutores autores={autores} />
    </section>
  );
}