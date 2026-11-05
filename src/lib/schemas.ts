import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "El usuario es obligatorio")
    .min(3, "Minimo 3 caracteres"),
  password: z
    .string()
    .min(1, "La contrasena es obligatoria")
    .min(6, "Minimo 6 caracteres"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const productoSchema = z.object({
  titulo: z
    .string()
    .min(1, "El titulo es obligatorio")
    .max(200, "Maximo 200 caracteres"),
  autor: z.number({ error: "Elegi un autor" }).int().min(1, "Elegi un autor"),
  editorial: z
    .number({ error: "Elegi una editorial" })
    .int()
    .min(1, "Elegi una editorial"),
  genero: z.number({ error: "Elegi un genero" }).int().min(1, "Elegi un genero"),
  fecha_publicacion: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa una fecha valida")
    .refine((v) => v <= new Date().toISOString().slice(0, 10), "No puede ser a futuro"),
  precio: z
    .number({ error: "Ingresa un precio" })
    .positive("Debe ser mayor a 0")
    .max(99999999, "Precio demasiado alto"),
  stock: z
    .number({ error: "Ingresa el stock" })
    .int("Debe ser un numero entero")
    .min(0, "No puede ser negativo"),
});

export type ProductoValues = z.infer<typeof productoSchema>;