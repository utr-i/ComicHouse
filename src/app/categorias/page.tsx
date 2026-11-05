
import Link from "next/link";
import { getCategorias } from "@/lib/api";

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl">
          Categorias
        </h1>
        <p className="mt-2 text-muted">
          Explora nuestros comics por genero.
        </p>
      </div>

      {categorias.length === 0 ? (
        <p className="py-16 text-center text-muted">
          Todavia no hay categorias disponibles.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/categorias/${categoria.slug}`}
              className="rounded-lg border border-line p-6 transition hover:border-ink"
            >
              <h2 className="font-display text-2xl">
                {categoria.nombre}
              </h2>

              <p className="mt-2 text-sm text-muted">
                {categoria.descripcion}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
