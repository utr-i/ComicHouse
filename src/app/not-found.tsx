import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <p className="text-sm text-muted">Error 404</p>
      <h1 className="font-display text-4xl">Esta pagina no existe</h1>
      <p className="text-muted">
        Puede que el enlace este roto o que la pagina se haya movido.
      </p>
      <Link
        href="/"
        className="rounded-full bg-lilac px-5 py-2 text-sm text-[#23212b] hover:opacity-80"
      >
        Volver al inicio
      </Link>
    </div>
  );
}