"use client";

import { useState } from "react";
import {
  crearGeneroAction,
  actualizarGeneroAction,
} from "@/app/actions/catalogo";

type Genero = {
  id: number;
  nombre: string;
  descripcion: string | null;
};

type Props = {
  genero?: Genero;
  onCancelar: () => void;
  onGuardado: () => void;
};

export default function FormularioGenero({
  genero,
  onCancelar,
  onGuardado,
}: Props) {
  const [nombre, setNombre] = useState(genero?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(genero?.descripcion ?? "");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const data = { nombre, descripcion };

    const resultado = genero
      ? await actualizarGeneroAction(genero.id, data)
      : await crearGeneroAction(data);

    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error ?? "No se pudo guardar el género");
      return;
    }

    onGuardado();
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm">Nombre</label>
        <input
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-ink"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-full border border-line px-4 py-2 text-sm"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={cargando}
          className="rounded-full bg-mint px-5 py-2 text-sm text-[#23212b] disabled:opacity-50"
        >
          {cargando
            ? "Guardando..."
            : genero
              ? "Guardar cambios"
              : "Crear género"}
        </button>
      </div>
    </form>
  );
}
