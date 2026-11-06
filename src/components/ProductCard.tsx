
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
    <Link
      href={`/catalogo/${producto.id}`}
      className="group flex min-w-0 flex-col gap-2 sm:gap-3"
    >
      <div
        className={`relative flex aspect-[3/4] min-w-0 flex-col overflow-hidden rounded-lg p-2 transition group-hover:-translate-y-1 sm:p-4 ${fondos[producto.color]}`}
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

        <div className="absolute inset-2 z-10 flex flex-col justify-between sm:inset-4">
          <span
            className={`w-fit max-w-full truncate rounded px-2 py-1 text-[9px] font-black uppercase tracking-wider sm:px-3 sm:py-1.5 sm:text-xs sm:tracking-widest ${
              portada
                ? "bg-black/85 text-white"
                : "bg-white/70 text-[#23212b]"
            }`}
          >
            {producto.editorial}
          </span>

          <span
            className={`line-clamp-3 break-words rounded-md px-2 py-2 font-display text-sm font-black uppercase leading-tight tracking-wide sm:px-3 sm:py-3 sm:text-xl ${
              portada
                ? "text-white drop-shadow-lg"
                : "text-[#23212b]"
            }`}
          >
            {producto.titulo}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-xs text-muted sm:text-sm">
          {producto.autor}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-1">
          <span className="text-sm font-medium sm:text-base">
            {formatPrecio(producto.precio)}
          </span>

          {producto.stock <= 5 && <Badge stock={producto.stock} />}
        </div>
      </div>
    </Link>
  );
}
