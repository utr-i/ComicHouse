import { describe, it, expect } from "vitest";
import { formatPrecio, etiquetaStock, slugify } from "@/lib/format";

describe("formatPrecio", () => {
  it("formatea en pesos argentinos sin decimales", () => {
    const r = formatPrecio(26900).replace(/\s/g, " ");
    expect(r).toContain("26.900");
    expect(r).toContain("$");
  });
});

describe("etiquetaStock", () => {
  it("marca agotado cuando no hay stock", () => {
    expect(etiquetaStock(0)).toBe("Agotado");
  });

  it("avisa cuando quedan pocas unidades", () => {
    expect(etiquetaStock(3)).toBe("Ultimas unidades");
  });

  it("marca disponible con stock normal", () => {
    expect(etiquetaStock(20)).toBe("Disponible");
  });
});

describe("slugify", () => {
  it("pasa a minusculas y une con guiones", () => {
    expect(slugify("Ciencia Ficcion")).toBe("ciencia-ficcion");
  });

  it("quita acentos y simbolos", () => {
    expect(slugify("Acci\u00f3n & Aventura!")).toBe("accion-aventura");
  });
});