
"use client";

import { useState } from "react";
import {
  crearEditorialAction,
  actualizarEditorialAction,
} from "@/app/actions/catalogo";

type Editorial = {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
};

type Props = {
  editorial?: Editorial;
  onCancelar: () => void;
  onGuardado: () => void;
};

export default function FormularioEditorial({
  editorial,
  onCancelar,
  onGuardado,
}: Props) {
  const [nombre, setNombre] = useState(editorial?.nombre ?? "");
  const [direccion, setDireccion] = useState(editorial?.direccion ?? "");
  const [telefono, setTelefono] = useState(editorial?.telefono ?? "");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function guardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const data = { nombre, direccion, telefono };

    const resultado = editorial
      ? await actualizarEditorialAction(editorial.id, data)
      : await crearEditorialAction(data);

    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error ?? "No se pudo guardar la editorial");
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
        <label className="mb-1 block text-sm">Dirección</label>
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-ink"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm">Teléfono</label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
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
            : editorial
              ? "Guardar cambios"
              : "Crear editorial"}
        </button>
      </div>
    </form>
  );
}
