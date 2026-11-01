import { logoutAction } from "@/app/actions/auth";

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-4xl">Panel</h1>
      <p className="text-muted">Sesion iniciada.</p>
      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-full border border-line px-5 py-2 text-sm hover:border-ink"
        >
          Cerrar sesion
        </button>
      </form>
    </section>
  );
}