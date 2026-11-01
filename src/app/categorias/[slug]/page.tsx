import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategoria, getProductos } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoria = await getCategoria(slug);

  if (!categoria) notFound();

  const data = await getProductos({ categoria: slug, pageSize: 50 });

  return (
    <section className="flex flex-col gap-8">
      <Link
        href="/categorias"
        className="flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} />
        Todas las categorias
      </Link>

      <div>
        <h1 className="font-display text-4xl">{categoria.nombre}</h1>
        <p className="mt-2 max-w-prose text-muted">{categoria.descripcion}</p>
        <p className="mt-1 text-sm text-muted">{data.count} productos</p>
      </div>

      <ProductGrid productos={data.results} />
    </section>
  );
}