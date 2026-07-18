"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Products", icon: Boxes, href: "/admin/products" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
];

type AdminShellProps = {
  adminEmail: string;
  activeLabel: string;
  children: ReactNode;
  onSectionChange?: (label: string) => void;
};

export function AdminShell({ adminEmail, activeLabel, children, onSectionChange }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
    router.refresh();
  }

  function isActive(label: string, href?: string) {
    if (href) return pathname === href || pathname.startsWith(`${href}/`);

    return pathname === "/admin" && activeLabel === label;
  }

  function itemClass(label: string, href?: string) {
    return cn(
      "flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
      isActive(label, href)
        ? "bg-cyan-400/15 text-cyan-700 dark:text-cyan-300"
        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3 rounded-3xl bg-slate-950 p-4 text-white dark:bg-white dark:text-slate-950">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400 text-slate-950">
              <Package className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold">GlamShot Admin</p>
              <p className="truncate text-xs opacity-70">{adminEmail}</p>
            </div>
          </div>
          <nav className="mt-5 grid gap-1">
            {sidebarItems.map((item) => {
              if (item.href) {
                return (
                  <Link key={item.label} href={item.href} className={itemClass(item.label, item.href)}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              }

              if (onSectionChange) {
                return (
                  <button key={item.label} onClick={() => onSectionChange(item.label)} className={itemClass(item.label)}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              }

              return (
                <Link key={item.label} href="/admin" className={itemClass(item.label)}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        {children}
      </div>
    </div>
  );
}
