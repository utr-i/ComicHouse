
import { listarGeneros } from "@/lib/api";
import TablaGeneros from "@/components/dashboard/generos/TablaGeneros";

export default async function DashboardGenerosPage() {
  const generos = await listarGeneros();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Géneros</h1>
        <p className="mt-2 text-muted">
          {generos.length} en total
        </p>
      </div>

      <TablaGeneros generos={generos} />
    </section>
  );
}
