import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="flex flex-col gap-6 py-8">
      <div>
        <h1 className="font-display text-4xl">Ingresar</h1>
        <p className="mt-2 text-muted">
          Acceso para el personal de Prisma Libros.
        </p>
      </div>
      <LoginForm />
    </section>
  );
}