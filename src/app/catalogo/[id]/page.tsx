import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProducto, getPortadaPorComic } from "@/lib/api";
import { formatPrecio } from "@/lib/format";
import { fondos } from "@/lib/colors";
import Badge from "@/components/Badge";

export const dynamic = "force-dynamic";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producto = await getProducto(Number(id));

  if (!producto) notFound();

  const portada = await getPortadaPorComic(Number(id));

  return (
    <article className="flex flex-col gap-8">
      <Link
        href="/catalogo"
        className="flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} />
        Volver al catalogo
      </Link>

      <div className="grid gap-10 md:grid-cols-[320px_1fr]">
        <div
          className={`relative flex aspect-[3/4] flex-col overflow-hidden rounded-lg p-6 text-[#23212b] ${fondos[producto.color]}`}
        >
          {portada && (
            <Image
              src={portada.imagen}
              alt={`Portada de ${producto.titulo}`}
              fill
              unoptimized
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          )}

          {portada && (
            <div className="absolute inset-0" />
          )}

        </div>

        <div className="flex flex-col gap-4">
          <Link
            href={`/categorias/${producto.categoria.slug}`}
            className="text-sm text-muted hover:text-ink"
          >
            {producto.categoria.nombre}
          </Link>

          <h1 className="font-display text-4xl">{producto.titulo}</h1>
          <p className="text-muted">{producto.autor}</p>
          <p className="text-2xl font-medium">
            {formatPrecio(producto.precio)}
          </p>
          <Badge stock={producto.stock} />

          <dl className="mt-4 grid max-w-md grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted">Autor</dt>
            <dd>{producto.autor}</dd>
            <dt className="text-muted">Editorial</dt>
            <dd>{producto.editorial}</dd>
            <dt className="text-muted">Publicacion</dt>
            <dd>{producto.anio}</dd>
            <dt className="text-muted">Unidades</dt>
            <dd>{producto.stock}</dd>
          </dl>
        </div>
      </div>
    </article>
  );
}