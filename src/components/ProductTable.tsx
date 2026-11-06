import Link from "next/link";
import { Pencil } from "lucide-react";
import type { Producto } from "@/types";
import { formatPrecio } from "@/lib/format";
import Badge from "@/components/Badge";
import DeleteButton from "@/components/DeleteButton";

export default function ProductTable({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) {
    return <p className="py-10 text-muted">No hay productos para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line text-muted">
          <tr>
            <th className="py-2 pr-4 font-normal">Titulo</th>
            <th className="py-2 pr-4 font-normal">Categoria</th>
            <th className="py-2 pr-4 font-normal">Precio</th>
            <th className="py-2 pr-4 font-normal">Stock</th>
            <th className="py-2 font-normal">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id} className="border-b border-line">
              <td className="py-3 pr-4">
                <p>{p.titulo}</p>
                <p className="text-xs text-muted">{p.autor}</p>
              </td>
              <td className="py-3 pr-4 text-muted">{p.categoria.nombre}</td>
              <td className="py-3 pr-4">{formatPrecio(p.precio)}</td>
              <td className="py-3 pr-4">
                {p.stock}{" "}
                {p.stock <= 5 && <Badge stock={p.stock} />}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/productos/${p.id}/editar`}
                    aria-label={`Editar ${p.titulo}`}
                    className="text-muted hover:text-ink"
                  >
                    <Pencil size={16} />
                  </Link>
                  <DeleteButton id={p.id} titulo={p.titulo} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}