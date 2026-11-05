import type { ColorPortada } from "@/lib/colors";

export type Categoria = {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
};

export type Producto = {
  id: number;
  titulo: string;
  autor: string;
  autorId: number | null;
  editorial: string;
  editorialId: number | null;
  categoria: Categoria;
  precio: number;
  stock: number;
  fechaPublicacion: string;
  anio: number;
  color: ColorPortada;
};

export type Opcion = { id: number; nombre: string };

export type Orden = "titulo" | "precio-asc" | "precio-desc";

export type FiltrosProductos = {
  search?: string;
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  orden?: Orden;
  page?: number;
};

export type Paginado<T> = {
  results: T[];
  count: number;
  page: number;
  totalPages: number;
};

export type Autor = {
  id: number;
  nombre: string;
  apellido: string;
  biografia: string;
};

export type Editorial = {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
};

export type Genero = {
  id: number;
  nombre: string;
  descripcion: string | null;
};

export type Portada = {
  id: number;
  comic: number;
  imagen: string;
  descripcion: string;
};

export type AutorValues = Omit<Autor, "id">;
export type EditorialValues = Omit<Editorial, "id">;
export type GeneroValues = Omit<Genero, "id">;