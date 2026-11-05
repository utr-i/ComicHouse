
import { getProductos } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
export const dynamic = "force-dynamic";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim();

  const data = await getProductos({
    page,
    search,
  });

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl">
          Nuestro catalogo
        </h1>
        <p className="mt-2 text-muted">
          Descubri todos nuestros comics y novedades.
        </p>
        <p className="mt-1 text-sm text-muted">
          {data.count} productos
        </p>
      </div>

      <ProductGrid productos={data.results} />

      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        params={{ search }}
        basePath="/catalogo"
      />
    </section>
  );
}
