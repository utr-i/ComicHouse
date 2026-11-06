"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productoSchema, type ProductoValues } from "@/lib/schemas";
import Image from "next/image";
import {
  actualizarProductoAction,
  crearProductoAction,
} from "@/app/actions/productos";
import FormField from "@/components/FormField";
import type { Categoria, Opcion, Producto, Portada } from "@/types";

export default function ProductForm({
  categorias,
  autores,
  editoriales,
  producto,
  portada,
}: {
  categorias: Categoria[];
  autores: Opcion[];
  editoriales: Opcion[];
  producto?: Producto;
  portada?: Portada | null;
}) {
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [imagen, setImagen] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductoValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: producto
      ? {
          titulo: producto.titulo,
          autor: producto.autorId ?? undefined,
          editorial: producto.editorialId ?? undefined,
          genero: producto.categoria.id,
          fecha_publicacion: producto.fechaPublicacion,
          precio: producto.precio,
          stock: producto.stock,
        }
      : undefined,
  });

function onSubmit(values: ProductoValues) {
  setErrorApi(null);

  startTransition(async () => {
    const formData = new FormData();

    Object.entries(values).forEach(([campo, valor]) => {
      formData.append(campo, String(valor));
    });

    if (imagen) {
      formData.append("imagen", imagen);
    }

    const res = producto
      ? await actualizarProductoAction(producto.id, formData)
      : await crearProductoAction(formData);

    if (res?.campos) {
      for (const [campo, mensajes] of Object.entries(res.campos)) {
        if (campo in values) {
          setError(campo as keyof ProductoValues, {
            message: mensajes.join(" "),
          });
        }
      }
    }

    if (res?.error) setErrorApi(res.error);
  });
  }

  const campo =
    "w-full rounded-lg border border-line bg-paper px-4 py-2 text-sm outline-none focus:border-ink";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex max-w-2xl flex-col gap-4"
    >
      <FormField label="Titulo" htmlFor="titulo" error={errors.titulo?.message}>
        <input id="titulo" className={campo} {...register("titulo")} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Autor" htmlFor="autor" error={errors.autor?.message}>
          <select
            id="autor"
            className={campo}
            {...register("autor", { valueAsNumber: true })}
          >
            <option value="">Elegir...</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Editorial"
          htmlFor="editorial"
          error={errors.editorial?.message}
        >
          <select
            id="editorial"
            className={campo}
            {...register("editorial", { valueAsNumber: true })}
          >
            <option value="">Elegir...</option>
            {editoriales.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Genero" htmlFor="genero" error={errors.genero?.message}>
          <select
            id="genero"
            className={campo}
            {...register("genero", { valueAsNumber: true })}
          >
            <option value="">Elegir...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Fecha de publicacion"
          htmlFor="fecha_publicacion"
          error={errors.fecha_publicacion?.message}
        >
          <input
            id="fecha_publicacion"
            type="date"
            className={campo}
            {...register("fecha_publicacion")}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Precio (ARS)"
          htmlFor="precio"
          error={errors.precio?.message}
        >
          <input
            id="precio"
            type="number"
            step="0.01"
            className={campo}
            {...register("precio", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Stock" htmlFor="stock" error={errors.stock?.message}>
          <input
            id="stock"
            type="number"
            className={campo}
            {...register("stock", { valueAsNumber: true })}
          />
        </FormField>
      </div>
      
      <div className="flex flex-col gap-2">
        <label htmlFor="imagen" className="text-sm font-medium">
          Portada del cómic
        </label>

        {portada && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted">Portada actual:</p>
            <Image
              src={portada.imagen}
              alt="Portada del cómic"
              width={144}
              height={192}
              unoptimized
              className="h-48 w-36 rounded-lg border border-line object-cover"
            />
          </div>
        )}

        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files?.[0] ?? null)}
          className="w-full rounded-lg border border-line bg-paper px-4 py-2 text-sm"
        />

        <p className="text-xs text-muted">
          {portada
            ? "Seleccioná otra imagen si querés reemplazar la portada actual."
            : "Seleccioná una imagen para la portada."}
        </p>
      </div>

      {errorApi && (
        <p className="rounded-lg bg-rose px-4 py-2 text-sm text-[#23212b]">
          {errorApi}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-lilac px-6 py-2 text-sm text-[#23212b] hover:opacity-80 disabled:opacity-50"
      >
        {pending
          ? "Guardando..."
          : producto
            ? "Guardar cambios"
            : "Crear producto"}
      </button>
    </form>
  );
}