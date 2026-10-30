import type { Producto } from "@/types";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return (
      <p className="py-16 text-center text-muted">
        No encontramos productos con esos filtros.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {productos.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  );
}