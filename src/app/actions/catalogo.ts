"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api";
import {
  crearAutor,
  actualizarAutor,
  eliminarAutor,
  crearEditorial,
  actualizarEditorial,
  eliminarEditorial,
  crearGenero,
  actualizarGenero,
  eliminarGenero,
} from "@/lib/api";

type Resultado = {
  ok: boolean;
  error?: string;
  campos?: Record<string, string[]>;
};

async function manejarError(error: unknown): Promise<Resultado> {
  if (error instanceof ApiError) {
    return {
      ok: false,
      error: error.message,
      campos: error.campos,
    };
  }

  return {
    ok: false,
    error: "Ocurrió un error inesperado",
  };
}

// AUTORES

export async function crearAutorAction(data: {
  nombre: string;
  apellido: string;
  biografia: string;
}): Promise<Resultado> {
  try {
    await crearAutor(data);
    revalidatePath("/dashboard/autores");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}

export async function actualizarAutorAction(
  id: number,
  data: {
    nombre: string;
    apellido: string;
    biografia: string;
  },
): Promise<Resultado> {
  try {
    await actualizarAutor(id, data);
    revalidatePath("/dashboard/autores");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}

export async function eliminarAutorAction(id: number): Promise<Resultado> {
  try {
    await eliminarAutor(id);
    revalidatePath("/dashboard/autores");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}

// EDITORIALES

export async function crearEditorialAction(data: {
  nombre: string;
  direccion: string;
  telefono: string;
}): Promise<Resultado> {
  try {
    await crearEditorial(data);
    revalidatePath("/dashboard/editoriales");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}

export async function actualizarEditorialAction(
  id: number,
  data: {
    nombre: string;
    direccion: string;
    telefono: string;
  },
): Promise<Resultado> {
  try {
    await actualizarEditorial(id, data);
    revalidatePath("/dashboard/editoriales");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}

export async function eliminarEditorialAction(id: number): Promise<Resultado> {
  try {
    await eliminarEditorial(id);
    revalidatePath("/dashboard/editoriales");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}

// GÉNEROS

export async function crearGeneroAction(data: {
  nombre: string;
  descripcion: string;
}): Promise<Resultado> {
  try {
    await crearGenero(data);
    revalidatePath("/dashboard/generos");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}

export async function actualizarGeneroAction(
  id: number,
  data: {
    nombre: string;
    descripcion: string;
  },
): Promise<Resultado> {
  try {
    await actualizarGenero(id, data);
    revalidatePath("/dashboard/generos");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}

export async function eliminarGeneroAction(id: number): Promise<Resultado> {
  try {
    await eliminarGenero(id);
    revalidatePath("/dashboard/generos");
    return { ok: true };
  } catch (error) {
    return manejarError(error);
  }
}
