import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-start gap-6 py-16">
      <h1 className="font-display text-5xl leading-tight md:text-6xl">
        Historias que <br /> merecen ser contadas.
      </h1>
      <p className="max-w-md text-muted">
        Tu lugar para descubrir cómics, mangas y novelas gráficas.
        Encontrá tus historias favoritas y nuevas aventuras.
      </p>
      <Link
        href="/catalogo"
        className="rounded-full bg-mint px-6 py-3 text-sm text-[#23212b] hover:opacity-80"
      >
        Ver catálogo
      </Link>
    </section>
  );
}
