import { getResumen } from "@/lib/api";

export default async function DashboardPage() {
  const r = await getResumen();

  const datos = [
    { label: "Productos", valor: r.total, fondo: "bg-lilac" },
    { label: "Categorias", valor: r.categorias, fondo: "bg-mint" },
    { label: "Ultimas unidades", valor: r.pocas, fondo: "bg-peach" },
    { label: "Agotados", valor: r.agotados, fondo: "bg-rose" },
  ];

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl">Panel</h1>
        <p className="mt-2 text-muted">Resumen del inventario.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {datos.map((d) => (
          <div
            key={d.label}
            className={`rounded-lg p-5 text-[#23212b] ${d.fondo}`}
          >
            <p className="font-display text-4xl">{d.valor}</p>
            <p className="text-sm opacity-70">{d.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}