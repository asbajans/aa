"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Video,
  Bot,
  GraduationCap,
  Calendar,
  Wallet,
  Menu,
  X,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

type Role = "student" | "teacher" | "superadmin";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const menuByRole: Record<Role, { label: string; items: MenuItem[] }[]> = {
  superadmin: [
    { label: "Genel", items: [{ href: "/superadmin", label: "Dashboard", icon: LayoutDashboard }] },
    {
      label: "Yönetim",
      items: [
        { href: "/superadmin/kullanicilar", label: "Kullanıcılar", icon: Users },
        { href: "/superadmin/paketler", label: "Paketler", icon: Package },
        { href: "/superadmin/branslar", label: "Branşlar", icon: Layers },
        { href: "/superadmin/siniflar", label: "Sınıflar", icon: GraduationCap },
        { href: "/superadmin/klonlar", label: "Akademi Klonları", icon: Bot },
      ],
    },
    { label: "Sistem", items: [{ href: "/kesfet", label: "Siteyi Gör", icon: BookOpen }] },
  ],
  teacher: [
    { label: "Genel", items: [{ href: "/ogretmen", label: "Panel", icon: LayoutDashboard }] },
    {
      label: "Sınıflar",
      items: [
        { href: "/ogretmen/siniflar", label: "Sınıflarım", icon: GraduationCap },
        { href: "/kesfet", label: "Keşfet", icon: BookOpen },
      ],
    },
    {
      label: "Dersler",
      items: [
        { href: "/ogretmen/canli", label: "Canlı Dersler", icon: Video },
        { href: "/ogretmen/program", label: "Programım", icon: Calendar },
        { href: "/ogretmen/basvurular", label: "Başvurular", icon: Users },
        { href: "/ogretmen/talepler", label: "1-1 Talepler", icon: Clock },
        { href: "/canli", label: "Canlı Oda", icon: Video },
      ],
    },
    { label: "Abonelik & Fiyatlar", items: [{ href: "/ogretmen/fiyatlar", label: "Fiyatlar", icon: Wallet }] },
    { label: "Akademi Klonu", items: [{ href: "/ogretmen/ai-klon", label: "Klon Stüdyosu", icon: Bot }] },
  ],
  student: [
    { label: "Genel", items: [{ href: "/ogrenci", label: "Panel", icon: LayoutDashboard }] },
    {
      label: "Öğren",
      items: [
        { href: "/kesfet", label: "Sınıfları Keşfet", icon: BookOpen },
        { href: "/ogrenci/siniflarim", label: "Sınıflarım", icon: GraduationCap },
        { href: "/ogrenci/program", label: "Programım", icon: Calendar },
      ],
    },
    {
      label: "Destek",
      items: [
        { href: "/paketler", label: "Paketler", icon: Package },
        { href: "/kvkk", label: "KVKK", icon: ShieldCheck },
      ],
    },
  ],
};

function isActive(pathname: string, href: string) {
  if (href.includes("#")) return pathname === href.split("#")[0];
  return pathname === href || pathname.startsWith(href + "/");
}

function NavList({ groups, pathname, onNavigate }: { groups: { label: string; items: MenuItem[] }[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-6 p-4">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="mb-2 px-2 text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">{g.label}</div>
          <div className="space-y-1">
            {g.items.map((it) => {
              const Icon = it.icon;
              const active = isActive(pathname, it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition ${active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"}`}
                >
                  <Icon size={16} className={active ? "text-white" : "text-zinc-500"} />
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar({ user }: { user: { name: string; email: string; role: string } }) {
  const pathname = usePathname();
  const role = (user.role as Role) || "student";
  const groups = menuByRole[role] || menuByRole.student;
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(true)} aria-label="Menüyü aç" className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white">
            <Menu size={18} />
          </button>
          <Link href={role === "superadmin" ? "/superadmin" : role === "teacher" ? "/ogretmen" : "/ogrenci"} className="flex items-center gap-2 font-bold">
            <span className="h-8 w-8 grid place-items-center rounded-lg bg-white border border-zinc-200 p-1 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="logo" className="h-full w-full object-contain" />
            </span>
            <span className="hidden sm:inline">akademi.biz.tr</span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-xs font-medium text-violet-700">
              <Sparkles size={11} /> {role}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-zinc-900">{user.name}</span>
            <span className="text-xs text-zinc-500">{user.email}</span>
          </div>
          <SignOutButton />
        </div>
      </header>

      {/* Desktop sidebar - fixed */}
      <aside className="hidden lg:block fixed left-0 top-14 bottom-0 w-64 border-r bg-zinc-50 overflow-y-auto">
        <NavList groups={groups} pathname={pathname} />
        <div className="p-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-600">
            <div className="font-semibold text-zinc-900 flex items-center gap-1"><Clock size={12} /> Destek</div>
            <div className="mt-1">KVKK uyumlu • Güvenli ödeme • 7/24 Akademi Klonu</div>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-white shadow-xl overflow-y-auto">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="font-bold">Menü</span>
              <button onClick={() => setOpen(false)} aria-label="Menüyü kapat" className="h-9 w-9 grid place-items-center rounded-xl border border-zinc-200">
                <X size={18} />
              </button>
            </div>
            <NavList groups={groups} pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
