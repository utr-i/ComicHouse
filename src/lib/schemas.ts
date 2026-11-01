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