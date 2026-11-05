import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiUrl } from "@/lib/config";
import { SESSION_COOKIE } from "@/lib/auth";
import { COLORES } from "@/lib/colors";
import { slugify } from "@/lib/format";
import type { ProductoValues } from "@/lib/schemas";
import type {
  Categoria,
  FiltrosProductos,
  Opcion,
  Orden,
  Paginado,
  Producto,
  Portada,
} from "@/types";

export const PAGE_SIZE = 10;

// Formato crudo que devuelve el Back (Django REST Framework)
type RawAutor = {
  id: number;
  nombre: string;
  apellido: string;
  biografia: string;
};
type RawEditorial = {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
};
type RawGenero = {
  id: number;
  nombre: string;
  descripcion: string | null 
  };
type RawComic = {
  id: number;
  titulo: string;
  autor: RawAutor | number;
  editorial: RawEditorial | number;
  genero: RawGenero | number;
  fecha_publicacion: string;
  precio: string | number;
  stock: number;
};
type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type AutorValues = {
  nombre: string;
  apellido: string;
  biografia: string;
};

type EditorialValues = {
  nombre: string;
  direccion: string;
  telefono: string;
};

type GeneroValues = {
  nombre: string;
  descripcion: string;
};

export class ApiError extends Error {
  status: number;
  campos: Record<string, string[]>;

  constructor(status: number, mensaje: string, campos: Record<string, string[]> = {}) {
    super(mensaje);
    this.status = status;
    this.campos = campos;
  }
}

async function errorDeApi(res: Response): Promise<ApiError> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // respuesta sin cuerpo JSON
  }

  const campos: Record<string, string[]> = {};
  let mensaje = `Error ${res.status} del servidor`;

  if (body && typeof body === "object") {
    for (const [clave, valor] of Object.entries(body)) {
      if (clave === "detail" && typeof valor === "string") mensaje = valor;
      else if (Array.isArray(valor)) campos[clave] = valor.map(String);
    }
  }
  if (Object.keys(campos).length > 0) mensaje = "Revisa los campos marcados";

  return new ApiError(res.status, mensaje, campos);
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !(init.body instanceof FormData)) {
  headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) redirect("/login");
    headers.set("Authorization", `Bearer ${token}`);
  }

const baseUrl = apiUrl();

let res: Response;

try {
  res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
} catch (error) {
  console.error("Error conectando con la API:", error);

  throw new ApiError(0, "No se pudo conectar con el servidor");
}

  if (!res.ok) {
    if (res.status === 401 && auth) redirect("/sesion-expirada");
    throw await errorDeApi(res);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// La API pagina todo: junta todas las paginas de un listado chico
async function listarTodo<T>(path: string, auth = false): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; page <= 50; page++) {
    const sep = path.includes("?") ? "&" : "?";
    const data = await request<Page<T>>(`${path}${sep}page=${page}`, {}, auth);
    items.push(...data.results);
    if (!data.next) break;
  }
  return items;
}

// Adaptadores: del formato del Back al formato que usa el front

const idDe = (v: { id: number } | number) => (typeof v === "number" ? v : v.id);

function aCategoria(g: RawGenero): Categoria {
  return {
    id: g.id,
    nombre: g.nombre,
    slug: slugify(g.nombre),
    descripcion: g.descripcion ?? "",
  };
}

function aProducto(raw: RawComic): Producto {
  const autor = typeof raw.autor === "object" ? raw.autor : null;
  const editorial = typeof raw.editorial === "object" ? raw.editorial : null;
  const genero = typeof raw.genero === "object" ? raw.genero : null;

  return {
    id: raw.id,
    titulo: raw.titulo,
    autor: autor ? `${autor.nombre} ${autor.apellido}` : "Autor no disponible",
    autorId: idDe(raw.autor),
    editorial: editorial ? editorial.nombre : "Editorial no disponible",
    editorialId: idDe(raw.editorial),
    categoria: genero
      ? aCategoria(genero)
      : { id: idDe(raw.genero), nombre: "Sin genero", slug: "sin-genero", descripcion: "" },
    precio: Number(raw.precio),
    stock: raw.stock,
    fechaPublicacion: raw.fecha_publicacion,
    anio: Number(raw.fecha_publicacion.slice(0, 4)),
    color: COLORES[raw.id % COLORES.length],
  };
}

const ORDENES: Record<Orden, string> = {
  titulo: "titulo",
  "precio-asc": "precio",
  "precio-desc": "-precio",
};

// Lectura

export async function getCategorias(): Promise<Categoria[]> {
  const generos = await listarTodo<RawGenero>("/generos/");
  return generos.map(aCategoria);
}

export async function getCategoria(slug: string): Promise<Categoria | null> {
  const categorias = await getCategorias();
  return categorias.find((c) => c.slug === slug) ?? null;
}

export async function getProductos(
  filtros: FiltrosProductos = {},
): Promise<Paginado<Producto>> {
  const { search, categoria, precioMin, precioMax, orden = "titulo", page = 1 } =
    filtros;

  const q = new URLSearchParams();
  if (search) q.set("search", search);
  if (categoria) {
    const cat = await getCategoria(categoria);
    if (!cat) return { results: [], count: 0, page: 1, totalPages: 1 };
    q.set("genero__nombre__icontains", cat.nombre);
  }
  if (precioMin !== undefined) q.set("precio__gte", String(precioMin));
  if (precioMax !== undefined) q.set("precio__lte", String(precioMax));
  q.set("ordering", ORDENES[orden]);
  q.set("page", String(page));

  try {
    const data = await request<Page<RawComic>>(`/comics/?${q.toString()}`);
    return {
      results: data.results.map(aProducto),
      count: data.count,
      page,
      totalPages: Math.max(1, Math.ceil(data.count / PAGE_SIZE)),
    };
  } catch (e) {
    // DRF responde 404 si la pagina pedida no existe
    if (e instanceof ApiError && e.status === 404) {
      return { results: [], count: 0, page: 1, totalPages: 1 };
    }
    throw e;
  }
}

export async function getProducto(id: number): Promise<Producto | null> {
  if (!Number.isInteger(id)) return null;
  try {
    return aProducto(await request<RawComic>(`/comics/${id}/`));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

async function contar(query: string): Promise<number> {
  const data = await request<Page<RawComic>>(`/comics/?${query}`);
  return data.count;
}

export async function getResumen() {
  const [total, agotados, pocas, categorias] = await Promise.all([
    contar(""),
    contar("stock__lte=0"),
    contar("stock__gt=0&stock__lte=5"),
    getCategorias(),
  ]);
  return { total, agotados, pocas, categorias: categorias.length };
}

// Autores y editoriales piden token: se usan en el formulario del dashboard

export async function getAutores(): Promise<Opcion[]> {
  const raw = await listarTodo<RawAutor>("/autores/", true);
  return raw.map((a) => ({ id: a.id, nombre: `${a.nombre} ${a.apellido}` }));
}

export async function getEditoriales(): Promise<Opcion[]> {
  const raw = await listarTodo<RawEditorial>("/editoriales/", true);
  return raw.map((e) => ({ id: e.id, nombre: e.nombre }));
}

// CRUD de autores

export async function listarAutores(): Promise<RawAutor[]> {
  return listarTodo<RawAutor>("/autores/", true);
}

export async function crearAutor(data: AutorValues): Promise<RawAutor> {
  return request<RawAutor>(
    "/autores/",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
}

export async function actualizarAutor(
  id: number,
  data: AutorValues,
): Promise<RawAutor> {
  return request<RawAutor>(
    `/autores/${id}/`,
    { method: "PUT", body: JSON.stringify(data) },
    true,
  );
}

export async function eliminarAutor(id: number): Promise<void> {
  await request<void>(`/autores/${id}/`, { method: "DELETE" }, true);
}

// CRUD de editoriales

export async function listarEditoriales(): Promise<RawEditorial[]> {
  return listarTodo<RawEditorial>("/editoriales/", true);
}

export async function crearEditorial(data: EditorialValues): Promise<RawEditorial> {
  return request<RawEditorial>(
    "/editoriales/",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
}

export async function actualizarEditorial(
  id: number,
  data: EditorialValues,
): Promise<RawEditorial> {
  return request<RawEditorial>(
    `/editoriales/${id}/`,
    { method: "PUT", body: JSON.stringify(data) },
    true,
  );
}

export async function eliminarEditorial(id: number): Promise<void> {
  await request<void>(`/editoriales/${id}/`, { method: "DELETE" }, true);
}

// CRUD de géneros

export async function listarGeneros(): Promise<RawGenero[]> {
  return listarTodo<RawGenero>("/generos/");
}

export async function crearGenero(data: GeneroValues): Promise<RawGenero> {
  return request<RawGenero>(
    "/generos/",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
}

export async function actualizarGenero(
  id: number,
  data: GeneroValues,
): Promise<RawGenero> {
  return request<RawGenero>(
    `/generos/${id}/`,
    { method: "PUT", body: JSON.stringify(data) },
    true,
  );
}

export async function eliminarGenero(id: number): Promise<void> {
  await request<void>(`/generos/${id}/`, { method: "DELETE" }, true);
}

// Escritura (requiere token)

export async function crearProducto(data: ProductoValues): Promise<Producto> {
  const raw = await request<RawComic>(
    "/comics/",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
  return aProducto(raw);
}

export async function actualizarProducto(
  id: number,
  data: ProductoValues,
): Promise<Producto> {
  const raw = await request<RawComic>(
    `/comics/${id}/`,
    { method: "PUT", body: JSON.stringify(data) },
    true,
  );
  return aProducto(raw);
}

export async function eliminarProducto(id: number): Promise<void> {
  await request<void>(`/comics/${id}/`, { method: "DELETE" }, true);
}

// Portadas

export async function listarPortadas(): Promise<Portada[]> {
  return listarTodo<Portada>("/portadas/");
}

export async function crearPortada(
  comic: number,
  imagen: File,
): Promise<Portada> {
  const formData = new FormData();
  formData.append("comic", String(comic));
  formData.append("imagen", imagen);

  return request<Portada>(
    "/portadas/",
    {
      method: "POST",
      body: formData,
    },
    true,
  );
}

export async function actualizarPortada(
  id: number,
  imagen: File,
): Promise<Portada> {
  const formData = new FormData();
  formData.append("imagen", imagen);

  return request<Portada>(
    `/portadas/${id}/`,
    {
      method: "PATCH",
      body: formData,
    },
    true,
  );
}
// buscar la portada asociada al ID del comic
export async function getPortadaPorComic(
  comicId: number,
): Promise<Portada | null> {
  const portadas = await listarPortadas();
  return portadas.find((portada) => portada.comic === comicId) ?? null;
}