"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4 py-10">
      <h1 className="font-display text-3xl">Algo salio mal en el panel</h1>
      <p className="text-muted">No pudimos cargar los datos. Intenta de nuevo.</p>
      <button
        onClick={reset}
        className="rounded-full bg-lilac px-5 py-2 text-sm text-[#23212b] hover:opacity-80"
      >
        Reintentar
      </button>
    </div>
  );
}