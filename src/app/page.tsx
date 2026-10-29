import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-8 text-black dark:bg-black dark:text-white">
      <h1 className="text-3xl font-bold">Prisma Libros</h1>
      <ThemeToggle />
    </main>
  );
}