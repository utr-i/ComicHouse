
import { Suspense } from "react";
import {
  getProductos,
  getCategorias,
  listarPortadas,
} from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import SearchFilters from "@/components/SearchFilters";

export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoria?: string;
    orden?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim();
  const categoria = params.categoria;
  const orden =
    params.orden === "precio-asc" || params.orden === "precio-desc"
      ? params.orden
      : "titulo";

  const [data, portadas, categorias] = await Promise.all([
    getProductos({ page, search, categoria, orden }),
    listarPortadas(),
    getCategorias(),
  ]);

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl">Nuestro catálogo</h1>
        <p className="mt-2 text-muted">
          Descubrí todos nuestros cómics y novedades.
        </p>
        <p className="mt-1 text-sm text-muted">
          {data.count} productos
        </p>
      </div>

      <Suspense fallback={<p className="text-muted">Cargando filtros...</p>}>
        <SearchFilters categorias={categorias} />
      </Suspense>

      <ProductGrid productos={data.results} portadas={portadas} />

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        params={{ search, categoria, orden }}
        basePath="/catalogo"
      />
    </section>
  );
}
