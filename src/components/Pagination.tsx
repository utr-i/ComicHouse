import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  params,
  basePath = "/catalogo",
}: {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (n: number) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== "page") q.set(k, v);
    });
    q.set("page", String(n));
    return `${basePath}?${q.toString()}`;
  };

  const base = "rounded-full border border-line px-4 py-2 text-sm";

  return (
    <nav className="mt-10 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} className={`${base} hover:border-ink`}>
          Anterior
        </Link>
      ) : (
        <span className={`${base} opacity-40`}>Anterior</span>
      )}
      <span className="text-sm text-muted">
        Pagina {page} de {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={`${base} hover:border-ink`}>
          Siguiente
        </Link>
      ) : (
        <span className={`${base} opacity-40`}>Siguiente</span>
      )}
    </nav>
  );
}