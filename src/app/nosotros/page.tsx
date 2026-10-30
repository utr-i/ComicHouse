import { Triangle } from "lucide-react";

const valores = [
  {
    titulo: "Curaduria",
    texto:
      "Elegimos cada titulo con criterio: clasicos que no pasan de moda y novedades que valen la pena.",
  },
  {
    titulo: "Historieta en serio",
    texto:
      "Comics, novelas graficas y manga tienen en nuestros estantes el mismo lugar que la novela.",
  },
  {
    titulo: "Atencion cercana",
    texto:
      "Recomendamos lo que nos gusta leer. Si no sabes por donde empezar, preguntanos.",
  },
];

export default function NosotrosPage() {
  return (
    <section className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Triangle size={28} className="text-lilac" strokeWidth={2.5} />
        <h1 className="font-display text-4xl">Sobre Prisma Libros</h1>
        <p className="leading-relaxed text-muted">
          Prisma Libros es una libreria de barrio con una idea simple: asi como
          un prisma separa la luz en todos sus colores, una buena libreria
          separa las historias en generos, voces y formatos para que cada
          lector encuentre el suyo.
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