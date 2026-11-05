import Link from "next/link";
import { Plus } from "lucide-react";
import { getProductos } from "@/lib/api";
import ProductTable from "@/components/ProductTable";
import Pagination from "@/components/Pagination";

export default async function DashboardProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const data = await getProductos({ search, page: Number(page) || 1 });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Productos</h1>
          <p className="mt-2 text-muted">{data.count} en total</p>
        </div>
        <Link
          href="/dashboard/productos/nuevo"
          className="flex items-center gap-2 rounded-full bg-mint px-5 py-2 text-sm text-[#23212b] hover:opacity-80"
        >
          <Plus size={16} />
          Nuevo
        </Link>
      </div>

      <form className="max-w-sm">
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar y presionar Enter"
          className="w-full rounded-full border border-line bg-paper px-4 py-2 text-sm outline-none focus:border-ink"
        />
      </form>

      <ProductTable productos={data.results} />
      <Pagination
        page={data.page}
        totalPages={data.totalPages}
        params={{ search }}
        basePath="/dashboard/productos"
      />
    </section>
  );
}