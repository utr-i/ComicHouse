import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Categoria } from "@/types";

export default function CategoryCard({
  categoria,
  color,
}: {
  categoria: Categoria;
  color: string;
}) {
  return (
    <Link
      href={`/categorias/${categoria.slug}`}
      className={`group flex min-h-40 flex-col justify-between rounded-lg p-5 text-[#23212b] transition hover:-translate-y-1 ${color}`}
    >
      <ArrowUpRight
        size={20}
        className="self-end opacity-60 transition group-hover:opacity-100"
      />
      <div>
        <h2 className="font-display text-2xl">{categoria.nombre}</h2>
        <p className="mt-1 text-sm opacity-70">{categoria.descripcion}</p>
      </div>
    </Link>
  );
}