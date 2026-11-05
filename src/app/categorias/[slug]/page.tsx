import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategoria, getProductos } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const categoria = await getCategoria(slug);

  if (!categoria) notFound();

  const data = await getProductos({ categoria: slug, page: Number(page) || 1 });

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
        {categoria.descripcion && (
          <p className="mt-2 max-w-prose text-muted">{categoria.descripcion}</p>
        )}
        <p className="mt-1 text-sm text-muted">{data.count} productos</p>
      </div>

      <ProductGrid productos={data.results} />
      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        params={{}}
        basePath={`/categorias/${slug}`}
      />
    </section>
  );
}