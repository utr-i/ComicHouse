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
  editorial: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  isbn: string;
  paginas: number;
  anio: number;
  descripcion: string;
  portada: string | null;
  color: "lilac" | "peach" | "mint" | "sky" | "rose";
};

export type ProductoInput = Omit<Producto, "id" | "categoria"> & {
  categoria: number;
};

export type Orden = "titulo" | "precio-asc" | "precio-desc";

export type FiltrosProductos = {
  search?: string;
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  orden?: Orden;
  page?: number;
  pageSize?: number;
};

export type Paginado<T> = {
  results: T[];
  count: number;
  page: number;
  totalPages: number;
};