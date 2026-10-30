"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <h1 className="font-display text-3xl">No pudimos cargar el catalogo</h1>
      <p className="text-muted">
        Hubo un problema al conectar con el servidor. Proba de nuevo en unos segundos.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-lilac px-5 py-2 text-sm text-[#23212b] hover:opacity-80"
      >
        Reintentar
      </button>
    </div>
  );
}