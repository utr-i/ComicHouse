import Link from "next/link";
import { getCategorias } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl">Categorías</h1>
        <p className="mt-2 text-muted">
          Explorá los comics por categoría.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <Link
            key={categoria.id}
            href={`/categorias/${categoria.slug}`}
            className="rounded-xl border border-line bg-paper p-6 transition hover:-translate-y-1 hover:border-ink"
          >
            <h2 className="font-display text-xl font-bold">
              {categoria.nombre}
            </h2>

            {categoria.descripcion && (
              <p className="mt-2 text-sm text-muted">
                {categoria.descripcion}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}