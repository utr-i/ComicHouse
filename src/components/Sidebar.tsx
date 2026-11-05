"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  Plus,
  LogOut,
  Users,
  Building2,
  Tags,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

const links = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/productos", label: "Productos", icon: Library },
  { href: "/dashboard/productos/nuevo", label: "Nuevo producto", icon: Plus },
  { href: "/dashboard/autores", label: "Autores", icon: Users },
  { href: "/dashboard/editoriales", label: "Editoriales", icon: Building2 },
  { href: "/dashboard/generos", label: "Géneros", icon: Tags },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col gap-1 md:w-52">
      {links.map(({ href, label, icon: Icon }) => {
        const activo =
          pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              activo ? "bg-lilac text-[#23212b]" : "text-muted hover:text-ink"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}

      <form action={logoutAction} className="mt-4 border-t border-line pt-4">
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-ink"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
