import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, users, teacherProfiles } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createBranch, toggleBranchActive, deleteBranch, assignBranchesToTeacher } from "./actions";

export const dynamic = "force-dynamic";

export default async function BranslarPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || session.user.role !== "superadmin") redirect("/giris");

  const allBranches = await db.select().from(categories).orderBy(categories.level, categories.nameTr).catch(() => []);
  const teachers = await db.select({ id: users.id, name: users.name, email: users.email, branches: teacherProfiles.branches }).from(users).leftJoin(teacherProfiles, eq(teacherProfiles.userId, users.id)).where(eq(users.role, "teacher")).limit(50).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Branş Yönetimi</h1>
          <p className="text-sm text-zinc-600">Branşları oluştur, aktif/pasif yap, öğretmenlere ata. Öğretmenler sadece atandıkları branşlarda sınıf açabilir.</p>
        </div>
        <Link href="/superadmin"><Button variant="outline">← SüperAdmin</Button></Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Yeni Branş Oluştur</CardTitle><CardDescription>Örn: Matematik, Fizik, Kimya — seviye LGS/YKS/Diğer</CardDescription></CardHeader>
        <CardContent>
          <form action={createBranch} className="grid md:grid-cols-4 gap-3">
            <input name="nameTr" placeholder="Branş adı (örn: Biyoloji)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <select name="level" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
              <option value="lgs">LGS</option>
              <option value="yks">YKS</option>
              <option value="other">Diğer</option>
            </select>
            <input name="icon" placeholder="İkon (örn: dna) opsiyonel" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <Button type="submit">Oluştur</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tüm Branşlar ({allBranches.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {allBranches.map((b) => (
              <div key={b.id} className="rounded-xl border border-zinc-200 bg-white p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-zinc-900">{b.nameTr} <span className="text-xs text-zinc-500">({b.level})</span> {b.icon && <span className="text-xs">• {b.icon}</span>}</div>
                  <div className="text-xs text-zinc-500">{b.slug} {b.isActive ? <Badge className="ml-1 bg-emerald-50 text-emerald-700 border-emerald-200">Aktif</Badge> : <Badge className="bg-zinc-100 text-zinc-600">Pasif</Badge>}</div>
                </div>
                <div className="flex gap-1">
                  <form action={async () => { "use server"; await toggleBranchActive(b.id, !b.isActive); }}><Button size="sm" variant="outline" type="submit">{b.isActive ? "Pasif Yap" : "Aktif Yap"}</Button></form>
                  <form action={async () => { "use server"; await deleteBranch(b.id); }}><Button size="sm" variant="ghost" className="text-red-600" type="submit">Sil</Button></form>
                </div>
              </div>
            ))}
            {allBranches.length === 0 && <div className="text-sm text-zinc-500">Henüz branş yok.</div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Öğretmene Branş Ata</CardTitle><CardDescription>Öğretmen sadece atandıkları branşlarda sınıf/ders açabilir. Boş bırakılırsa tüm branşlarda açabilir (esnek).</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {teachers.length === 0 ? <div className="text-sm text-zinc-500">Henüz öğretmen yok.</div> : teachers.map((t) => (
            <form key={t.id} action={assignBranchesToTeacher} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="font-medium text-zinc-900">{t.name} <span className="text-xs text-zinc-500">({t.email})</span></div>
              <div className="text-xs text-zinc-500">Mevcut: {(t.branches as string[] | null)?.join(", ") || "— (tüm branşlar)"}</div>
              <input type="hidden" name="teacherId" value={t.id} />
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {allBranches.map((b) => (
                  <label key={b.id} className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" name="branches" value={b.nameTr} defaultChecked={(t.branches as string[] | null)?.includes(b.nameTr)} />
                    {b.nameTr}
                  </label>
                ))}
              </div>
              <Button size="sm" type="submit" className="mt-3">Kaydet</Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
