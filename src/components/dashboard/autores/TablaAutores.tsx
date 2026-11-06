"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import FormularioAutor from "./FormularioAutor";
import DeleteAutorButton from "./DeleteAutorButton";

type Autor = {
  id: number;
  nombre: string;
  apellido: string;
  biografia: string;
};

export default function TablaAutores({
  autores,
}: {
  autores: Autor[];
}) {
  const router = useRouter();
  const [autorSeleccionado, setAutorSeleccionado] = useState<Autor | undefined>();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  function nuevoAutor() {
    setAutorSeleccionado(undefined);
    setMostrarFormulario(true);
  }

  function editarAutor(autor: Autor) {
    setAutorSeleccionado(autor);
    setMostrarFormulario(true);
  }

  function cerrarFormulario() {
    setMostrarFormulario(false);
    setAutorSeleccionado(undefined);
  }

  function guardarFormulario() {
    cerrarFormulario();
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={nuevoAutor}
          className="flex items-center gap-2 rounded-full bg-mint px-5 py-2 text-sm text-[#23212b] hover:opacity-80"
        >
          <Plus size={16} />
          Nuevo autor
        </button>
      </div>

      {autores.length === 0 ? (
        <p className="py-10 text-muted">No hay autores para mostrar.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="py-2 pr-4 font-normal">Nombre</th>
                <th className="py-2 pr-4 font-normal">Biografía</th>
                <th className="py-2 font-normal">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {autores.map((autor) => (
                <tr key={autor.id} className="border-b border-line">
                  <td className="py-3 pr-4">
                    {autor.nombre} {autor.apellido}
                  </td>

                  <td className="max-w-md py-3 pr-4 text-muted">
                    {autor.biografia || "Sin biografía"}
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => editarAutor(autor)}
                        aria-label={`Editar ${autor.nombre} ${autor.apellido}`}
                        className="text-muted hover:text-ink"
                      >
                        <Pencil size={16} />
                      </button>

                      <DeleteAutorButton
                        id={autor.id}
                        nombre={`${autor.nombre} ${autor.apellido}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarFormulario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-paper p-6 shadow-xl">
            <h2 className="mb-5 font-display text-2xl">
              {autorSeleccionado ? "Editar autor" : "Nuevo autor"}
            </h2>

            <FormularioAutor
              autor={autorSeleccionado}
              onCancelar={cerrarFormulario}
              onGuardado={guardarFormulario}
            />
          </div>
        </div>
      )}
    </>
  );
}