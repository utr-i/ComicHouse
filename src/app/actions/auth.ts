"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/schemas";
import { loginConApi, SESSION_COOKIE } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(
  values: unknown,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { error: "Datos invalidos" };

  const res = await loginConApi(parsed.data.username, parsed.data.password);
  if (!res.ok) return { error: res.error };

  const store = await cookies();
  store.set(SESSION_COOKIE, res.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}