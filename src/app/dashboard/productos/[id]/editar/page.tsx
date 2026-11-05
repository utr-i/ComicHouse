import { notFound } from "next/navigation";
import {
  getAutores,
  getCategorias,
  getEditoriales,
  getProducto,
  getPortadaPorComic,
} from "@/lib/api";
import ProductForm from "@/components/ProductForm";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [producto, categorias, autores, editoriales, portada] = await Promise.all([
    getProducto(Number(id)),
    getCategorias(),
    getAutores(),
    getEditoriales(),
    getPortadaPorComic(Number(id)),
  ]);

  if (!producto) notFound();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">Editar producto</h1>
      <ProductForm
        categorias={categorias}
        autores={autores}
        editoriales={editoriales}
        producto={producto}
        portada={portada}
      />
    </section>
  );
}