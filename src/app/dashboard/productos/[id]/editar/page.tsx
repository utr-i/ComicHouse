import { notFound } from "next/navigation";
import {
  getAutores,
  getCategorias,
  getEditoriales,
  getProducto,
} from "@/lib/api";
import ProductForm from "@/components/ProductForm";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [producto, categorias, autores, editoriales] = await Promise.all([
    getProducto(Number(id)),
    getCategorias(),
    getAutores(),
    getEditoriales(),
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
      />
    </section>
  );
}