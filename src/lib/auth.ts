import { apiUrl } from "@/lib/config";

export const SESSION_COOKIE = "prisma_token";

type LoginResult =
  | { ok: true; token: string; username: string }
  | { ok: false; error: string };

export async function loginConApi(
  username: string,
  password: string,
): Promise<LoginResult> {
  try {
    const res = await fetch(`${apiUrl()}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    if (res.status === 400 || res.status === 401) {
      return { ok: false, error: "Usuario o contrasena incorrectos" };
    }
    if (!res.ok) {
      return { ok: false, error: "El servidor respondio con un error" };
    }

    const data = (await res.json()) as { access: string; refresh: string };
    return { ok: true, token: data.access, username };
  } catch {
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}