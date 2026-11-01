export const SESSION_COOKIE = "prisma_token";

type LoginResult =
  | { ok: true; token: string; username: string }
  | { ok: false; error: string };

/* despues reemplazamos por la api real */
export async function loginConApi(
  username: string,
  password: string,
): Promise<LoginResult> {
  await new Promise((r) => setTimeout(r, 400));

  if (username === "admin" && password === "admin123") {
    return { ok: true, token: "mock-token-prisma", username };
  }
  return { ok: false, error: "Usuario o contrasena incorrectos" };
}