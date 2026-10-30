import { getCategorias } from "@/lib/api";
import { fondos } from "@/lib/colors";
import CategoryCard from "@/components/CategoryCard";

const colores = [
  fondos.lilac,
  fondos.peach,
  fondos.mint,
  fondos.sky,
  fondos.rose,
];

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl">Categorias</h1>
        <p className="mt-2 text-muted">Explora la libreria por genero.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((c, i) => (
          <CategoryCard
            key={c.id}
            categoria={c}
            color={colores[i % colores.length]}
          />
        ))}
      </div>
    </section>
  );
}