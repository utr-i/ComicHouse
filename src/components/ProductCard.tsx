import Link from "next/link";
import Image from "next/image";
import type { Producto, Portada } from "@/types";
import { formatPrecio } from "@/lib/format";
import Badge from "@/components/Badge";
import { fondos } from "@/lib/colors";

export default function ProductCard({
  producto,
  portada,
}: {
  producto: Producto;
  portada?: Portada;
}) {
  return (
    <Link href={`/catalogo/${producto.id}`} className="group flex flex-col gap-3">
      <div
        className={`relative flex aspect-[3/4] flex-col overflow-hidden rounded-lg p-4 transition group-hover:-translate-y-1 ${fondos[producto.color]}`}
      >
        {portada && (
          <Image
            src={portada.imagen}
            alt={`Portada de ${producto.titulo}`}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {portada && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/20 to-black/90" />
        )}

        <div className="absolute inset-4 z-10 flex flex-col justify-between">
          <span
            className={`w-fit rounded px-3 py-1.5 text-xs font-black uppercase tracking-widest ${
              portada
                ? "bg-black/85 text-white"
                : "bg-white/70 text-[#23212b]"
            }`}
          >
            {producto.editorial}
          </span>

          <span
            className={`rounded-md px-3 py-3 font-display text-xl font-black uppercase leading-tight tracking-wide ${
              portada
                ? " text-white drop-shadow-lg"
                : " text-[#23212b]"
            }`}
          >
            {producto.titulo}
          </span>
        </div>
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