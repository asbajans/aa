import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, userCredits } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { UsersTable, type AdminUser } from "../UsersTable";

export const dynamic = "force-dynamic";

export default async function SuperAdminKullanicilarPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || session.user.role !== "superadmin") redirect("/giris");

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isBanned: users.isBanned,
      createdAt: users.createdAt,
      credits: userCredits.balance,
    })
    .from(users)
    .leftJoin(userCredits, eq(userCredits.userId, users.id))
    .orderBy(sql`${users.createdAt} DESC`)
    .limit(200);

  const adminUsers: AdminUser[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    isBanned: r.isBanned,
    credits: r.credits ?? 0,
    createdAt: r.createdAt?.toISOString?.() || String(r.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kullanıcı Yönetimi ({adminUsers.length})</h1>
          <p className="text-sm text-zinc-600">Rol değiştir, kredi ekle, banla — anında uygulanır.</p>
        </div>
        <Link href="/superadmin" className="text-sm text-zinc-500 hover:text-zinc-900">← Dashboard</Link>
      </div>
      <Card>
        <CardHeader><CardTitle>Tüm Kullanıcılar</CardTitle></CardHeader>
        <CardContent>
          <UsersTable users={adminUsers} />
        </CardContent>
      </Card>
    </div>
  );
}
