import { getAutores, getCategorias, getEditoriales } from "@/lib/api";
import ProductForm from "@/components/ProductForm";

export default async function NuevoProductoPage() {
  const [categorias, autores, editoriales] = await Promise.all([
    getCategorias(),
    getAutores(),
    getEditoriales(),
  ]);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">Nuevo producto</h1>
      {(autores.length === 0 || editoriales.length === 0) && (
        <p className="text-sm text-muted">
          Para crear un producto primero tiene que haber al menos un autor y una
          editorial cargados en el Back.
        </p>
      )}
      <ProductForm
        categorias={categorias}
        autores={autores}
        editoriales={editoriales}
      />
    </section>
  );
}