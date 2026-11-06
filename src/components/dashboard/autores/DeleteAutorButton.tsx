"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { eliminarAutorAction } from "@/app/actions/catalogo";

export default function DeleteAutorButton({
  id,
  nombre,
}: {
  id: number;
  nombre: string;
}) {
  const router = useRouter();
  const [confirmar, setConfirmar] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function borrar() {
    startTransition(async () => {
      const res = await eliminarAutorAction(id);

      if (!res.ok) {
        setError(res.error ?? "No se pudo eliminar el autor");
        return;
      }

      setConfirmar(false);
      setError("");
      router.refresh();
    });
  }

  if (confirmar) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <span className="text-muted">
          ¿Eliminar a {nombre}? Los cómics asociados también podrían eliminarse.
        </span>
        <button
          onClick={borrar}
          disabled={pending}
          className="rounded-full bg-rose px-3 py-1 text-[#23212b] disabled:opacity-50"
        >
          {pending ? "Borrando..." : "Sí, borrar"}
        </button>

        <button
          onClick={() => {
            setConfirmar(false);
            setError("");
          }}
          className="text-muted hover:text-ink"
        >
          Cancelar
        </button>

        {error && <span className="text-red-500">{error}</span>}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <button
        onClick={() => setConfirmar(true)}
        aria-label={`Borrar ${nombre}`}
        className="text-muted hover:text-ink"
      >
        <Trash2 size={16} />
      </button>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </span>
  );
}