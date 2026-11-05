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

export async function crearProductoAction(values: unknown): Promise<ActionState> {
  if (!(await haySesion())) redirect("/login");

  const parsed = productoSchema.safeParse(values);
  if (!parsed.success) return { error: "Datos invalidos" };

  try {
    await crearProducto(parsed.data);
  } catch (e) {
    return aEstado(e);
  }

  revalidatePath("/catalogo");
  revalidatePath("/dashboard/productos");
  redirect("/dashboard/productos");
}

export async function actualizarProductoAction(
  id: number,
  values: unknown,
): Promise<ActionState> {
  if (!(await haySesion())) redirect("/login");

  const parsed = productoSchema.safeParse(values);
  if (!parsed.success) return { error: "Datos invalidos" };

  try {
    await actualizarProducto(id, parsed.data);
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