import { categorias, productosIniciales } from "@/lib/mock-data";
import type {
  Categoria,
  FiltrosProductos,
  Paginado,
  Producto,
} from "@/types";

// Copia en memoria para poder simular crear, editar y borrar
let productos: Producto[] = [...productosIniciales];

const espera = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getProductos(
  filtros: FiltrosProductos = {},
): Promise<Paginado<Producto>> {
  await espera();

  const {
    search,
    categoria,
    precioMin,
    precioMax,
    orden = "titulo",
    page = 1,
    pageSize = 8,
  } = filtros;

  let lista = [...productos];

  if (search) {
    const q = search.toLowerCase();
    lista = lista.filter(
      (p) =>
        p.titulo.toLowerCase().includes(q) ||
        p.autor.toLowerCase().includes(q) ||
        p.editorial.toLowerCase().includes(q),
    );
  }
  if (categoria) lista = lista.filter((p) => p.categoria.slug === categoria);
  if (precioMin !== undefined) lista = lista.filter((p) => p.precio >= precioMin);
  if (precioMax !== undefined) lista = lista.filter((p) => p.precio <= precioMax);

  lista.sort((a, b) => {
    if (orden === "precio-asc") return a.precio - b.precio;
    if (orden === "precio-desc") return b.precio - a.precio;
    return a.titulo.localeCompare(b.titulo, "es");
  });

  const count = lista.length;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const inicio = (page - 1) * pageSize;

  return {
    results: lista.slice(inicio, inicio + pageSize),
    count,
    page,
    totalPages,
  };
}

export async function getProducto(id: number): Promise<Producto | null> {
  await espera();
  return productos.find((p) => p.id === id) ?? null;
}

export async function getCategorias(): Promise<Categoria[]> {
  await espera(150);
  return categorias;
}

export async function getCategoria(slug: string): Promise<Categoria | null> {
  await espera(150);
  return categorias.find((c) => c.slug === slug) ?? null;
}