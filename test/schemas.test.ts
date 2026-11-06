import { describe, it, expect } from "vitest";
import { loginSchema, productoSchema } from "@/lib/schemas";

describe("loginSchema", () => {
  it("acepta credenciales validas", () => {
    const r = loginSchema.safeParse({ username: "francisco", password: "Admin123." });
    expect(r.success).toBe(true);
  });

  it("rechaza usuario vacio", () => {
    const r = loginSchema.safeParse({ username: "", password: "admin123" });
    expect(r.success).toBe(false);
  });

  it("rechaza contrasena corta", () => {
    const r = loginSchema.safeParse({ username: "francisco", password: "123" });
    expect(r.success).toBe(false);
  });
});

describe("productoSchema", () => {
  const valido = {
    titulo: "Batman: Year One",
    autor: 1,
    editorial: 1,
    genero: 1,
    fecha_publicacion: "1987-02-01",
    precio: 8500,
    stock: 12,
  };

  it("acepta un producto valido", () => {
    expect(productoSchema.safeParse(valido).success).toBe(true);
  });

  it("rechaza un precio negativo", () => {
    expect(productoSchema.safeParse({ ...valido, precio: -5 }).success).toBe(false);
  });

  it("rechaza un titulo vacio", () => {
    expect(productoSchema.safeParse({ ...valido, titulo: "" }).success).toBe(false);
  });

  it("rechaza una fecha a futuro", () => {
    expect(
      productoSchema.safeParse({ ...valido, fecha_publicacion: "2999-01-01" }).success,
    ).toBe(false);
  });

  it("rechaza si no se eligio autor", () => {
    expect(productoSchema.safeParse({ ...valido, autor: NaN }).success).toBe(false);
  });
});