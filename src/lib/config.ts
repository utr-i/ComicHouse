export function apiUrl(): string {
  const url = process.env.API_URL;
  if (!url) throw new Error("Falta la variable de entorno API_URL");
  return url.replace(/\/$/, "");
}