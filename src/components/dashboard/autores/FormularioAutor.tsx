"use client";

import { useState } from "react";
import {
  crearAutorAction,
  actualizarAutorAction,
} from "@/app/actions/catalogo";

type Autor = {
  id: number;
  nombre: string;
  apellido: string;
  biografia: string;
};

type Props = {
  autor?: Autor;
  onCancelar: () => void;
  onGuardado: () => void;
};

export default function FormularioAutor({
  autor,
  onCancelar,
  onGuardado,
}: Props) {
  const [nombre, setNombre] = useState(autor?.nombre ?? "");
  const [apellido, setApellido] = useState(autor?.apellido ?? "");
  const [biografia, setBiografia] = useState(autor?.biografia ?? "");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const data = { nombre, apellido, biografia };

    const resultado = autor
      ? await actualizarAutorAction(autor.id, data)
      : await crearAutorAction(data);

    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error ?? "No se pudo guardar el autor");
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
        <label className="mb-1 block text-sm">Apellido</label>
        <input
          required
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm">Biografía</label>
        <textarea
          value={biografia}
          onChange={(e) => setBiografia(e.target.value)}
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
          {cargando ? "Guardando..." : autor ? "Guardar cambios" : "Crear autor"}
        </button>
      </div>
    </form>
  );
}
