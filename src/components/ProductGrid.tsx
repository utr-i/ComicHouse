import type { Producto, Portada } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({
  productos,
  portadas,
}: {
  productos: Producto[];
  portadas: Portada[];
}) {
  if (productos.length === 0) {
    return (
      <p className="py-16 text-center text-muted">
        No encontramos productos con esos filtros.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((p) => {
        const portada = portadas.find((imagen) => imagen.comic === p.id);

        return (
          <ProductCard
            key={p.id}
            producto={p}
            portada={portada}
          />
        );
      })}
    </div>
  );
}