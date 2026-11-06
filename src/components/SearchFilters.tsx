
"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import type { Categoria } from "@/types";

function FiltroDropdown({
  valor,
  opciones,
  onChange,
}: {
  valor: string;
  opciones: { value: string; label: string }[];
  onChange: (valor: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);

  const seleccionada =
    opciones.find((opcion) => opcion.value === valor) ?? opciones[0];

  return (
    <div className="relative w-full min-w-0 sm:w-auto sm:min-w-48">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        className="flex w-full min-w-0 items-center justify-between gap-3 rounded-full border border-line bg-paper px-4 py-2 text-sm outline-none hover:border-ink"
      >
        <span className="truncate">{seleccionada.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${
            abierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {abierto && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-line bg-paper p-1 shadow-lg">
          {opciones.map((opcion) => (
            <button
              key={opcion.value}
              type="button"
              onClick={() => {
                onChange(opcion.value);
                setAbierto(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-line ${
                valor === opcion.value ? "bg-line font-medium" : ""
              }`}
            >
              {opcion.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

  const categoriasOpciones = [
    { value: "", label: "Todas las categorías" },
    ...categorias.map((c) => ({
      value: c.slug,
      label: c.nombre,
    })),
  ];

  const ordenOpciones = [
    { value: "titulo", label: "Orden alfabético" },
    { value: "precio-asc", label: "Menor precio" },
    { value: "precio-desc", label: "Mayor precio" },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          actualizar({ search });
        }}
        className="relative w-full min-w-0 sm:w-72"
      >
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar título, autor o editorial"
          className="w-full min-w-0 rounded-full border border-line bg-paper py-2 pl-9 pr-4 text-sm outline-none focus:border-ink"
        />
      </form>

      <FiltroDropdown
        valor={params.get("categoria") ?? ""}
        opciones={categoriasOpciones}
        onChange={(valor) => actualizar({ categoria: valor })}
      />

      <FiltroDropdown
        valor={params.get("orden") ?? "titulo"}
        opciones={ordenOpciones}
        onChange={(valor) => actualizar({ orden: valor })}
      />
    </div>
  );
}
