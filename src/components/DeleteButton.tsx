"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { eliminarProductoAction } from "@/app/actions/productos";

export default function DeleteButton({
  id,
  titulo,
}: {
  id: number;
  titulo: string;
}) {
  const [confirmar, setConfirmar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function borrar() {
    startTransition(async () => {
      const res = await eliminarProductoAction(id);
      if (res.error) setError(res.error);
      setConfirmar(false);
    });
  }

  if (confirmar) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <span className="text-muted">Borrar "{titulo}"?</span>
        <button
          onClick={borrar}
          disabled={pending}
          className="rounded-full bg-rose px-3 py-1 text-[#23212b] disabled:opacity-50"
        >
          {pending ? "Borrando..." : "Si, borrar"}
        </button>
        <button
          onClick={() => setConfirmar(false)}
          className="text-muted hover:text-ink"
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <button
        onClick={() => setConfirmar(true)}
        aria-label={`Borrar ${titulo}`}
        className="text-muted hover:text-ink"
      >
        <Trash2 size={16} />
      </button>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </span>
  );
}