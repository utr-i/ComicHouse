"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { productoSchema } from "@/lib/schemas";
import { SESSION_COOKIE } from "@/lib/auth";
import {
  ApiError,
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  crearPortada,
  listarPortadas,
  actualizarPortada,
} from "@/lib/api";

export type ActionState = {
  error?: string;
  campos?: Record<string, string[]>;
};

async function haySesion() {
  const store = await cookies();
  return Boolean(store.get(SESSION_COOKIE)?.value);
}

// Solo traduce errores de la API; cualquier otro (incluido redirect) se relanza
function aEstado(e: unknown): ActionState {
  if (e instanceof ApiError) return { error: e.message, campos: e.campos };
  throw e;
}

export async function crearProductoAction(
  formData: FormData,
): Promise<ActionState> {
  if (!(await haySesion())) redirect("/login");

  const values = {
    titulo: formData.get("titulo"),
    autor: Number(formData.get("autor")),
    editorial: Number(formData.get("editorial")),
    genero: Number(formData.get("genero")),
    fecha_publicacion: formData.get("fecha_publicacion"),
    precio: Number(formData.get("precio")),
    stock: Number(formData.get("stock")),
  };

  const parsed = productoSchema.safeParse(values);
  if (!parsed.success) return { error: "Datos inválidos" };

  const imagen = formData.get("imagen");

  try {
    const producto = await crearProducto(parsed.data);

    if (imagen instanceof File && imagen.size > 0) {
      await crearPortada(producto.id, imagen);
    }
  } catch (e) {
    return aEstado(e);
  }

  revalidatePath("/catalogo");
  revalidatePath("/dashboard/productos");
  redirect("/dashboard/productos");
}

export async function actualizarProductoAction(
  id: number,
  formData: FormData,
): Promise<ActionState> {
  if (!(await haySesion())) redirect("/login");

  const values = {
    titulo: formData.get("titulo"),
    autor: Number(formData.get("autor")),
    editorial: Number(formData.get("editorial")),
    genero: Number(formData.get("genero")),
    fecha_publicacion: formData.get("fecha_publicacion"),
    precio: Number(formData.get("precio")),
    stock: Number(formData.get("stock")),
  };

  const parsed = productoSchema.safeParse(values);
  if (!parsed.success) return { error: "Datos inválidos" };

  const imagen = formData.get("imagen");

  try {
    await actualizarProducto(id, parsed.data);

    if (imagen instanceof File && imagen.size > 0) {
      const portadas = await listarPortadas();
      const portadaActual = portadas.find((p) => p.comic === id);

      if (portadaActual) {
        await actualizarPortada(portadaActual.id, imagen);
      } else {
        await crearPortada(id, imagen);
      }
    }
  } catch (e) {
    return aEstado(e);
  }

  revalidatePath("/catalogo");
  revalidatePath(`/catalogo/${id}`);
  revalidatePath("/dashboard/productos");
  redirect("/dashboard/productos");
}

export async function eliminarProductoAction(id: number): Promise<ActionState> {
  if (!(await haySesion())) redirect("/login");

  try {
    await eliminarProducto(id);
  } catch (e) {
    return aEstado(e);
  }

  revalidatePath("/catalogo");
  revalidatePath("/dashboard/productos");
  return {};
}