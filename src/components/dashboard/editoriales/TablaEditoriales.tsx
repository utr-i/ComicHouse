"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { eliminarEditorialAction } from "@/app/actions/catalogo";
import FormularioEditorial from "./FormularioEditorial";

type Editorial = {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
};

export default function TablaEditoriales({
  editoriales,
}: {
  editoriales: Editorial[];
}) {
  const router = useRouter();

  const [editorialEditar, setEditorialEditar] = useState<Editorial | null>(null);
  const [nuevo, setNuevo] = useState(false);
  const [confirmar, setConfirmar] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function borrar(id: number) {
    setError("");

    startTransition(async () => {
      const res = await eliminarEditorialAction(id);

      if (!res.ok) {
        setError(res.error ?? "No se pudo eliminar la editorial");
        return;
      }

      setConfirmar(null);
      router.refresh();
    });
  }

  function cerrarFormulario() {
    setNuevo(false);
    setEditorialEditar(null);
  }

  function guardado() {
    cerrarFormulario();
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          onClick={() => setNuevo(true)}
          className="flex items-center gap-2 rounded-full bg-mint px-5 py-2 text-sm text-[#23212b] hover:opacity-80"
        >
          <Plus size={16} />
          Nueva editorial
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {editoriales.length === 0 ? (
        <p className="py-10 text-muted">
          No hay editoriales para mostrar.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="py-2 pr-4 font-normal">Nombre</th>
                <th className="py-2 pr-4 font-normal">Dirección</th>
                <th className="py-2 pr-4 font-normal">Teléfono</th>
                <th className="py-2 font-normal">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {editoriales.map((editorial) => (
                <tr key={editorial.id} className="border-b border-line">
                  <td className="py-3 pr-4">{editorial.nombre}</td>
                  <td className="py-3 pr-4 text-muted">
                    {editorial.direccion || "Sin dirección"}
                  </td>
                  <td className="py-3 pr-4 text-muted">
                    {editorial.telefono || "Sin teléfono"}
                  </td>

                  <td className="py-3">
                    {confirmar === editorial.id ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-muted">¿Borrar?</span>

                        <button
                          onClick={() => borrar(editorial.id)}
                          disabled={pending}
                          className="rounded-full bg-rose px-3 py-1 text-[#23212b] disabled:opacity-50"
                        >
                          {pending ? "Borrando..." : "Sí, borrar"}
                        </button>

                        <button
                          onClick={() => setConfirmar(null)}
                          className="text-muted hover:text-ink"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setEditorialEditar(editorial)}
                          aria-label={`Editar ${editorial.nombre}`}
                          className="text-muted hover:text-ink"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => setConfirmar(editorial.id)}
                          aria-label={`Borrar ${editorial.nombre}`}
                          className="text-muted hover:text-ink"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(nuevo || editorialEditar) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-paper p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl">
                {editorialEditar ? "Editar editorial" : "Nueva editorial"}
              </h2>

              <button
                onClick={cerrarFormulario}
                aria-label="Cerrar"
                className="text-muted hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <FormularioEditorial
              editorial={editorialEditar ?? undefined}
              onCancelar={cerrarFormulario}
              onGuardado={guardado}
            />
          </div>
        </div>
      )}
    </div>
  );
}
