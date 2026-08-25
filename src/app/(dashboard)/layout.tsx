import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) {
    redirect("/giris");
  }
  const user = session.user;
  const roleHome = user.role === "superadmin" ? "/superadmin" : user.role === "teacher" ? "/ogretmen" : "/ogrenci";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href={roleHome} className="flex items-center gap-2 font-bold text-zinc-900">
            <span className="h-8 w-8 grid place-items-center rounded-lg bg-white border border-zinc-200 p-1 overflow-hidden">
              <img src="/logo.png" alt="logo" className="h-full w-full object-contain" />
            </span>
            akademi.biz.tr
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-sm font-medium text-zinc-900">{user.name}</span>
              <span className="text-xs text-zinc-500">{user.email} • {user.role}</span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
