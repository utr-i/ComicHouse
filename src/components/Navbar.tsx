
"use client";

import Link from "next/link";
import { useState } from "react";
import { Triangle, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/categorias", label: "Categorías" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/login", label: "Ingresar" },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="bg-paper">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Triangle size={20} className="shrink-0 text-lilac" strokeWidth={2.5} />
          <span className="font-display text-xl tracking-tight">
            Comic House
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-muted hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            className="text-ink"
          >
            {menuAbierto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuAbierto && (
        <div className="flex flex-col gap-4 border-t border-line px-6 py-4 text-sm md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuAbierto(false)}
              className="text-muted hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

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
