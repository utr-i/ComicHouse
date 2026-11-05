
import { listarEditoriales } from "@/lib/api";
import TablaEditoriales from "@/components/dashboard/editoriales/TablaEditoriales";

export default async function DashboardEditorialesPage() {
  const editoriales = await listarEditoriales();

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl">Editoriales</h1>
        <p className="mt-2 text-muted">
          {editoriales.length} en total
        </p>
      </div>

      <TablaEditoriales editoriales={editoriales} />
    </section>
  );
}
