"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Categoria } from "@/types";

export default function SearchFilters({
  categorias,
}: {
  categorias: Categoria[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");

  function actualizar(cambios: Record<string, string>) {
    const nuevos = new URLSearchParams(params.toString());
    Object.entries(cambios).forEach(([k, v]) => {
      if (v) nuevos.set(k, v);
      else nuevos.delete(k);
    });
    nuevos.delete("page");
    router.push(`${pathname}?${nuevos.toString()}`);
  }

  const campo =
    "rounded-full border border-line bg-paper px-4 py-2 text-sm outline-none focus:border-ink";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          actualizar({ search });
        }}
        className="relative"
      >
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar titulo, autor o editorial"
          className={`${campo} w-72 pl-9`}
        />
      </form>

      <select
        value={params.get("categoria") ?? ""}
        onChange={(e) => actualizar({ categoria: e.target.value })}
        className={campo}
      >
        <option value="">Todas las categorias</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.nombre}
          </option>
        ))}
      </select>

      <select
        value={params.get("orden") ?? "titulo"}
        onChange={(e) => actualizar({ orden: e.target.value })}
        className={campo}
      >
        <option value="titulo">Orden alfabetico</option>
        <option value="precio-asc">Menor precio</option>
        <option value="precio-desc">Mayor precio</option>
      </select>
    </div>
  );
}