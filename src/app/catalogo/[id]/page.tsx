
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, MapPin } from "lucide-react";
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

  const mensaje = `Hola! Estoy interesado en el cómic "${producto.titulo}". Quería consultar si está disponible.`;
  const whatsapp = `https://wa.me/5493585168615?text=${encodeURIComponent(mensaje)}`;

  return (
    <article className="flex flex-col gap-8">
      <Link
        href="/catalogo"
        className="flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} />
        Volver al catálogo
      </Link>

      <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-paper">
        {portada ? (
          <Image
            src={portada.imagen}
            alt={`Portada de ${producto.titulo}`}
            fill
            unoptimized
            priority
            className="object-contain"
            sizes="100vw"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${fondos[producto.color]}`}
          >
            <span className="text-xl font-bold">{producto.titulo}</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <section className="rounded-2xl border border-line bg-paper p-6">
          <Link
            href={`/categorias/${producto.categoria.slug}`}
            className="text-xs font-bold uppercase tracking-widest text-ink"
          >
            {producto.categoria.nombre}
          </Link>

          <h1 className="mt-3 font-display text-3xl font-bold">
            {producto.titulo}
          </h1>

          <p className="mt-2 text-sm text-muted">{producto.autor}</p>

          <div className="my-6 border-t border-line" />

          <h2 className="mb-3 text-sm font-semibold">Información del cómic</h2>

          <dl className="grid grid-cols-2 gap-y-4 text-sm">
            <dt className="text-muted">Autor</dt>
            <dd>{producto.autor}</dd>

            <dt className="text-muted">Editorial</dt>
            <dd>{producto.editorial}</dd>

            <dt className="text-muted">Publicación</dt>
            <dd>{producto.anio}</dd>

            <dt className="text-muted">Unidades disponibles</dt>
            <dd>{producto.stock}</dd>
          </dl>
        </section>

        <aside className="flex h-fit flex-col gap-5 rounded-2xl border border-line bg-paper p-6">
          <div>
            <p className="text-sm text-muted">Precio del cómic</p>
            <p className="mt-1 text-3xl font-bold text-ink">
              {formatPrecio(producto.precio)}
            </p>
          </div>

          <div className="border-t border-line pt-5">
            <Badge stock={producto.stock} />

            <h2 className="mt-5 font-semibold">
              ¿Te interesa este cómic?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              Consultanos por WhatsApp para obtener más información sobre este cómic.
            </p>
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
          >
            <MessageCircle size={19} />
            Contactar librería
          </a>
        </aside>
      </div>
    </article>
  );
}
