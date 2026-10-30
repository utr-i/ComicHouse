import { getCategorias, getProductos } from "@/lib/api";
import type { Orden } from "@/types";
import SearchFilters from "@/components/SearchFilters";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";

type SearchParams = Promise<{
  search?: string;
  categoria?: string;
  orden?: string;
  page?: string;
}>;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const [categorias, data] = await Promise.all([
    getCategorias(),
    getProductos({
      search: sp.search,
      categoria: sp.categoria,
      orden: (sp.orden as Orden) || "titulo",
      page,
    }),
  ]);

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl">Catalogo</h1>
        <p className="mt-2 text-muted">{data.count} productos</p>
      </div>

      <SearchFilters categorias={categorias} />
      <ProductGrid productos={data.results} />
      <Pagination page={data.page} totalPages={data.totalPages} params={sp} />
    </section>
  );
}