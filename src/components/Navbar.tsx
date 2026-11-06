import Link from "next/link";
import { Triangle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/catalogo", label: "Catalogo" },
  { href: "/categorias", label: "Categorias" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/login", label: "Ingresar" },
];

export default function Navbar() {
  return (
    <header className="bg-paper">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Triangle size={20} className="text-lilac" strokeWidth={2.5} />
          <span className="font-display text-xl tracking-tight">
            Comic House
          </span>
        </Link>

        <ul className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-muted hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
      <div className="flex h-1">
        <span className="flex-1 bg-rose" />
        <span className="flex-1 bg-peach" />
        <span className="flex-1 bg-mint" />
        <span className="flex-1 bg-sky" />
        <span className="flex-1 bg-lilac" />
      </div>
    </header>
  );
}