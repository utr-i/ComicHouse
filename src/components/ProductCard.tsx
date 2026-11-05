import Link from "next/link";
import type { Producto } from "@/types";
import { formatPrecio } from "@/lib/format";
import { fondos } from "@/lib/colors";
import Badge from "@/components/Badge";

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <Link href={`/catalogo/${producto.id}`} className="group flex flex-col gap-3">
      <div
        className={`flex aspect-[3/4] flex-col justify-between rounded-lg p-4 text-[#23212b] transition group-hover:-translate-y-1 ${fondos[producto.color]}`}
      >
        <span className="text-xs uppercase tracking-wide opacity-70">
          {producto.editorial}
        </span>
        <span className="font-display text-xl leading-tight">
          {producto.titulo}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted">{producto.autor}</p>
        <div className="flex items-center justify-between">
          <span className="font-medium">{formatPrecio(producto.precio)}</span>
          {producto.stock <= 5 && <Badge stock={producto.stock} />}
        </div>
      </div>
    </Link>
  );
}