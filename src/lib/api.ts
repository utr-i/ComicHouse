// Importamos lo necesario para manejar cookies, redirecciones y la API
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

// Tipos con la estructura original que devuelve Django
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
  descripcion: string | null;
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

// Estructura que devuelve Django cuando los resultados vienen paginados
type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Datos que recibimos de los formularios
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

// Creamos un error propio para manejar mejor los errores de la API
export class ApiError extends Error {
  status: number;
  campos: Record<string, string[]>;

  constructor(status: number, mensaje: string, campos: Record<string, string[]> = {}) {
    super(mensaje);
    this.status = status;
    this.campos = campos;
  }
}

// Lee el error que devuelve Django y prepara un mensaje para mostrar
async function errorDeApi(res: Response): Promise<ApiError> {
  let body: unknown = null;

  try {
    body = await res.json();
  } catch {
    // Puede pasar que el servidor no devuelva contenido JSON
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

// Función general para hacer las peticiones al backend
async function request<T>(
  path: string, // Ruta del recurso que queremos consultar
  init: RequestInit = {}, // Método y datos que vamos a enviar
  auth = false, // Indica si necesitamos iniciar sesión
): Promise<T> { //Devuelve una promesa que su resultado sera tipo T
  // Preparamos los encabezados de la petición
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  // Si enviamos datos normales, indicamos que son JSON
  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Si necesita autenticación, buscamos el token guardado en la cookie
  if (auth) {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;

    // Si no hay token, volvemos al login
    if (!token) redirect("/login");

    headers.set("Authorization", `Bearer ${token}`);
  }

  // Obtenemos la dirección del backend -> https://back-3y41.onrender.com/api
  const baseUrl = apiUrl();

  let res: Response;

  try {
    // Enviamos la petición al backend
    res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    // Si no se puede conectar con el servidor, mostramos un error
    console.error("Error conectando con la API:", error);
    throw new ApiError(0, "No se pudo conectar con el servidor");
  }

  // Si la respuesta no fue exitosa, manejamos el error
  if (!res.ok) {
    if (res.status === 401 && auth) redirect("/sesion-expirada");
    throw await errorDeApi(res);
  }

  // Si el servidor responde sin contenido, devolvemos undefined
  if (res.status === 204) return undefined as T;

  // Convertimos la respuesta JSON y la devolvemos
  return (await res.json()) as T;
}

// Junta los resultados de todas las páginas de un listado
async function listarTodo<T>(path: string, auth = false): Promise<T[]> {
  const items: T[] = [];

  for (let page = 1; page <= 50; page++) {
    // Agregamos el número de página a la URL
    const sep = path.includes("?") ? "&" : "?";
    const data = await request<Page<T>>(`${path}${sep}page=${page}`, {}, auth);

    items.push(...data.results);

    // Si no hay otra página, dejamos de buscar
    if (!data.next) break;
  }

  return items;
}

// Adaptamos los datos del backend al formato que usamos en el frontend

// Obtiene el ID aunque Django devuelva un objeto o solamente un número
const idDe = (v: { id: number } | number) =>
  typeof v === "number" ? v : v.id;

// Convierte un género del backend en una categoría para el frontend
function aCategoria(g: RawGenero): Categoria {
  return {
    id: g.id,
    nombre: g.nombre,
    slug: slugify(g.nombre),
    descripcion: g.descripcion ?? "",
  };
}

// Convierte un cómic del backend al formato que usamos en la aplicación
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

// Relaciona las opciones de orden con los campos que entiende Django
const ORDENES: Record<Orden, string> = {
  titulo: "titulo",
  "precio-asc": "precio",
  "precio-desc": "-precio",
};

// CONSULTAS

// Obtiene todas las categorías
export async function getCategorias(): Promise<Categoria[]> {
  const generos = await listarTodo<RawGenero>("/generos/");
  return generos.map(aCategoria);
}

// Busca una categoría por su slug
export async function getCategoria(slug: string): Promise<Categoria | null> {
  const categorias = await getCategorias();
  return categorias.find((c) => c.slug === slug) ?? null;
}

// Obtiene los productos aplicando los filtros seleccionados
export async function getProductos(
  filtros: FiltrosProductos = {},
): Promise<Paginado<Producto>> {
  const { search, categoria, precioMin, precioMax, orden = "titulo", page = 1 } =
    filtros;

  // Armamos los parámetros que se envían en la URL
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
    // Consultamos los cómics con los filtros seleccionados
    const data = await request<Page<RawComic>>(`/comics/?${q.toString()}`);

    return {
      results: data.results.map(aProducto),
      count: data.count,
      page,
      totalPages: Math.max(1, Math.ceil(data.count / PAGE_SIZE)),
    };
  } catch (e) {
    // Si la página no existe, devolvemos un listado vacío
    if (e instanceof ApiError && e.status === 404) {
      return { results: [], count: 0, page: 1, totalPages: 1 };
    }

    throw e;
  }
}

// Busca un producto por su ID
export async function getProducto(id: number): Promise<Producto | null> {
  if (!Number.isInteger(id)) return null;

  try {
    return aProducto(await request<RawComic>(`/comics/${id}/`));
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

// Cuenta los productos que coinciden con una consulta
async function contar(query: string): Promise<number> {
  const data = await request<Page<RawComic>>(`/comics/?${query}`);
  return data.count;
}

// Obtiene los números que mostramos en el resumen del dashboard
export async function getResumen() {
  const [total, agotados, pocas, categorias] = await Promise.all([
    contar(""),
    contar("stock__lte=0"),
    contar("stock__gt=0&stock__lte=5"),
    getCategorias(),
  ]);

  return { total, agotados, pocas, categorias: categorias.length };
}

// AUTORES Y EDITORIALES

// Obtiene autores para usarlos como opciones en los formularios
export async function getAutores(): Promise<Opcion[]> {
  const raw = await listarTodo<RawAutor>("/autores/", true);
  return raw.map((a) => ({ id: a.id, nombre: `${a.nombre} ${a.apellido}` }));
}

// Obtiene editoriales para usarlas como opciones
export async function getEditoriales(): Promise<Opcion[]> {
  const raw = await listarTodo<RawEditorial>("/editoriales/", true);
  return raw.map((e) => ({ id: e.id, nombre: e.nombre }));
}

// CRUD DE AUTORES

// Lista todos los autores
export async function listarAutores(): Promise<RawAutor[]> {
  return listarTodo<RawAutor>("/autores/", true);
}

// Crea un autor nuevo
export async function crearAutor(data: AutorValues): Promise<RawAutor> {
  return request<RawAutor>(
    "/autores/",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
}

// Modifica un autor existente
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

// Elimina un autor
export async function eliminarAutor(id: number): Promise<void> {
  await request<void>(`/autores/${id}/`, { method: "DELETE" }, true);
}

// CRUD DE EDITORIALES

// Lista todas las editoriales
export async function listarEditoriales(): Promise<RawEditorial[]> {
  return listarTodo<RawEditorial>("/editoriales/", true);
}

// Crea una editorial nueva
export async function crearEditorial(data: EditorialValues): Promise<RawEditorial> {
  return request<RawEditorial>(
    "/editoriales/",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
}

// Modifica una editorial
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

// Elimina una editorial
export async function eliminarEditorial(id: number): Promise<void> {
  await request<void>(`/editoriales/${id}/`, { method: "DELETE" }, true);
}

// CRUD DE GÉNEROS

// Lista todos los géneros
export async function listarGeneros(): Promise<RawGenero[]> {
  return listarTodo<RawGenero>("/generos/");
}

// Crea un género nuevo
export async function crearGenero(data: GeneroValues): Promise<RawGenero> {
  return request<RawGenero>(
    "/generos/",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );
}

// Modifica un género
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

// Elimina un género
export async function eliminarGenero(id: number): Promise<void> {
  await request<void>(`/generos/${id}/`, { method: "DELETE" }, true);
}

// CRUD DE PRODUCTOS

// Crea un cómic y devuelve los datos adaptados al frontend
export async function crearProducto(data: ProductoValues): Promise<Producto> {
  const raw = await request<RawComic>(
    "/comics/",
    { method: "POST", body: JSON.stringify(data) },
    true,
  );

  return aProducto(raw);
}

// Modifica un cómic existente
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

// Elimina un cómic
export async function eliminarProducto(id: number): Promise<void> {
  await request<void>(`/comics/${id}/`, { method: "DELETE" }, true);
}

// PORTADAS

// Obtiene todas las portadas
export async function listarPortadas(): Promise<Portada[]> {
  return listarTodo<Portada>("/portadas/");
}

// Crea una portada y la relaciona con un cómic
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

// Actualiza la imagen de una portada
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

// Busca la portada que pertenece a un cómic
export async function getPortadaPorComic(
  comicId: number,
): Promise<Portada | null> {
  const portadas = await listarPortadas();
  return portadas.find((portada) => portada.comic === comicId) ?? null;
}