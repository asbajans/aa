import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { users, userCredits, packages, classes, aiClones } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { UsersTable, type AdminUser } from "./UsersTable";

export default async function SuperAdminPanel() {
  // Guard: sadece superadmin
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "superadmin") {
    redirect(session.user.role === "teacher" ? "/ogretmen" : "/ogrenci");
  }

  // Gerçek veriler — hata olursa boş liste
  let adminUsers: AdminUser[] = [];
  let stats = { users: 0, teachers: 0, students: 0, classes: 0, clones: 0, pendingClones: 0, packages: 0 };
  let dbError: string | null = null;

  try {
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
      .limit(100);

    adminUsers = rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      isBanned: r.isBanned,
      credits: r.credits ?? 0,
      createdAt: r.createdAt?.toISOString?.() || String(r.createdAt),
    }));

    const [userCount] = await db.select({ c: sql<number>`count(*)::int` }).from(users);
    const [teacherCount] = await db.select({ c: sql<number>`count(*)::int` }).from(users).where(eq(users.role, "teacher"));
    const [studentCount] = await db.select({ c: sql<number>`count(*)::int` }).from(users).where(eq(users.role, "student"));
    const [classCount] = await db.select({ c: sql<number>`count(*)::int` }).from(classes);
    const [cloneCount] = await db.select({ c: sql<number>`count(*)::int` }).from(aiClones);
    const [pkgCount] = await db.select({ c: sql<number>`count(*)::int` }).from(packages);

    stats = {
      users: userCount?.c ?? 0,
      teachers: teacherCount?.c ?? 0,
      students: studentCount?.c ?? 0,
      classes: classCount?.c ?? 0,
      clones: cloneCount?.c ?? 0,
      pendingClones: 0,
      packages: pkgCount?.c ?? 0,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Veritabanı hatası";
    dbError = msg.includes("does not exist")
      ? "Veritabanı tabloları yok — Portainer konsolunda `npm run db:push && npm run db:seed` çalıştır."
      : msg;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">SüperAdmin Paneli</h1>
          <p className="text-sm text-zinc-600">Kullanıcı, rol, kredi ve moderasyon — tek yerden. Giriş: {session.user.email}</p>
        </div>
        <Badge className="bg-amber-100 text-amber-800 border border-amber-200">Admin: {session.user.name}</Badge>
      </div>

      {dbError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-sm text-red-700">
            <b>DB hatası:</b> {dbError}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-6 gap-3">
        {[
          { label: "Kullanıcı", value: stats.users },
          { label: "Öğretmen", value: stats.teachers },
          { label: "Öğrenci", value: stats.students },
          { label: "Sınıf", value: stats.classes },
          { label: "Akademi Klonu", value: stats.clones },
          { label: "Paket", value: stats.packages },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <div className="text-2xl font-black text-zinc-900">{s.value}</div>
              <div className="text-xs text-zinc-500">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Yönetimi</CardTitle>
          <CardDescription>Rol değiştir, kredi ekle, banla — anında uygulanır.</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={adminUsers} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Paketler</CardTitle><CardDescription>{stats.packages} paket • SaaS fiyatlandırma</CardDescription></CardHeader>
          <CardContent className="space-y-2"><Link href="/superadmin/paketler"><Button className="w-full">Yönet</Button></Link><Link href="/paketler" className="text-xs underline text-zinc-500">Öğrenci görünümü</Link></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sınıflar</CardTitle><CardDescription>{stats.classes} sınıf • tüm öğretmenler</CardDescription></CardHeader>
          <CardContent><Link href="/superadmin/siniflar"><Button variant="outline" className="w-full">Tüm Sınıflar</Button></Link></CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader><CardTitle>Akademi Klonları</CardTitle><CardDescription>{stats.clones} klon • onayla/reddet</CardDescription></CardHeader>
          <CardContent className="space-y-2"><Link href="/superadmin/klonlar"><Button variant="outline" className="w-full">Klonları Gör</Button></Link><Badge>Onay bekleyen: {stats.pendingClones}</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Hakediş</CardTitle><CardDescription>Komisyon %20 canlı / %30 klon</CardDescription></CardHeader>
          <CardContent className="text-xs text-zinc-500">Öğretmen başına oran ve periyot ayarlanır. Yakında.</CardContent>
        </Card>
      </div>
    </div>
  );
}
