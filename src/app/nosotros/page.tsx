
import { Triangle } from "lucide-react";

const valores = [
  {
    titulo: "Curaduría",
    texto:
      "Elegimos cada cómic, manga y novela gráfica buscando historias que valga la pena descubrir.",
  },
  {
    titulo: "Pasión por las historias",
    texto:
      "Desde los grandes clásicos hasta las últimas novedades, damos lugar a distintos géneros y estilos.",
  },
  {
    titulo: "Atención cercana",
    texto:
      "Te ayudamos a encontrar tu próxima lectura y recomendamos historias según tus gustos.",
  },
];

export default function NosotrosPage() {
  return (
    <section className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Triangle size={28} className="text-lilac" strokeWidth={2.5} />
        <h1 className="font-display text-4xl">Sobre Prisma Libros</h1>
        <p className="leading-relaxed text-muted">
          Prisma Libros es un espacio dedicado al mundo de los cómics, mangas y
          novelas gráficas. Buscamos reunir historias, personajes y universos
          diferentes para que cada lector encuentre algo que lo sorprenda.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {valores.map((v) => (
          <div key={v.titulo} className="border-t border-line pt-4">
            <h2 className="font-display text-xl">{v.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{v.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
