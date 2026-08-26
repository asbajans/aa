import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) {
    redirect("/giris");
  }
  const user = session.user as { name: string; email: string; role: string };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Sidebar user={user} />
      {/* Content offset for desktop sidebar */}
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </div>
    </div>
  );
}
