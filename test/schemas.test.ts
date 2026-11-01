import { describe, it, expect } from "vitest";
import { loginSchema } from "@/lib/schemas";

describe("loginSchema", () => {
  it("acepta credenciales validas", () => {
    const r = loginSchema.safeParse({ username: "admin", password: "admin123" });
    expect(r.success).toBe(true);
  });

  it("rechaza usuario vacio", () => {
    const r = loginSchema.safeParse({ username: "", password: "admin123" });
    expect(r.success).toBe(false);
  });

  it("rechaza contrasena corta", () => {
    const r = loginSchema.safeParse({ username: "admin", password: "123" });
    expect(r.success).toBe(false);
  });
});