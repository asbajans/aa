import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { classes, categories, teacherProfiles } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createClass, updateClass, requestClassDeletion } from "../actions";
import { scheduleLabel } from "@/lib/schedule";

export const dynamic = "force-dynamic";

export default async function OgretmenSiniflarPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") redirect("/ogrenci");

  const profile = (await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, session.user.id)).limit(1).catch(() => []))[0];
  const allCats = await db.select().from(categories).where(eq(categories.isActive, true)).limit(50).catch(() => []);
  const assigned = (profile?.branches as string[] | null) || [];
  const cats = assigned.length === 0 ? allCats : allCats.filter((c) => assigned.includes(c.nameTr));
  const myClasses = await db.select().from(classes).where(eq(classes.teacherId, session.user.id)).orderBy(classes.createdAt).limit(50).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sınıflarım ({myClasses.length})</h1>
          <p className="text-sm text-zinc-600">Sınıf oluştur, düzenle. Silme talepleri SuperAdmin onayına gider.</p>
        </div>
        <Link href="/superadmin/siniflar" className="hidden md:inline text-xs text-zinc-400">Admin görünümü →</Link>
      </div>

      {cats.length === 0 ? (
        <Card className="border-amber-200 bg-amber-50/50"><CardContent className="pt-6 text-sm text-amber-800">Sana atanmış aktif branş yok. SuperAdmin&apos;den branş atanmasını iste.</CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="flex gap-2 items-center"><Plus size={16} /> Yeni Sınıf</CardTitle><CardDescription>Sadece atandığın branşlarda açabilirsin: {cats.map((c) => c.nameTr).join(", ")}</CardDescription></CardHeader>
          <CardContent>
            <form action={createClass} className="grid md:grid-cols-2 gap-3">
              <input name="title" placeholder="Sınıf başlığı (örn: LGS Matematik Hız Kampı)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 md:col-span-2" />
              <textarea name="description" placeholder="Açıklama / müfredat" rows={2} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 md:col-span-2" />
              <select name="categoryId" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
                <option value="">Branş seç</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.nameTr} ({c.level})</option>)}
              </select>
              <select name="level" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
                <option value="lgs">LGS</option>
                <option value="yks">YKS</option>
                <option value="other">Diğer</option>
              </select>
            <input name="priceCredits" type="number" placeholder="Sınıf abonelik fiyatı (kredi)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <input name="capacity" type="number" min={1} max={10} defaultValue={10} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <div className="md:col-span-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 space-y-3">
              <div className="text-xs font-semibold text-zinc-700">📅 Ders Periyodu (ilk 4 ders otomatik planlanır)</div>
              <div className="grid md:grid-cols-3 gap-2">
                <select name="scheduleType" defaultValue="weekly" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                  <option value="none">Esnek (plan yok)</option>
                </select>
                <input name="scheduleTime" type="time" defaultValue="18:00" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
                <input name="durationMinutes" type="number" defaultValue={60} min={15} placeholder="Süre (dk)" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Haftalık günler (Haftalık seçilirse):</div>
                <div className="flex flex-wrap gap-2">
                  {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map((d, i) => (
                    <label key={d} className="flex items-center gap-1 text-sm border border-zinc-200 rounded-lg px-2 py-1 bg-white">
                      <input type="checkbox" name="scheduleDays" value={i} defaultChecked={i === 0 || i === 3} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Aylık günler (Aylık seçilirse, virgülle):</div>
                <input name="scheduleMonthDays" placeholder="5,15,25" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
              </div>
            </div>
            <Button type="submit" className="md:col-span-2">Sınıfı Oluştur</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {myClasses.map((c) => (
          <Card key={c.id} className={c.deletionRequested ? "border-red-200 bg-red-50/30" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between items-center">{c.title} {c.deletionRequested && <Badge className="bg-red-100 text-red-700 border-red-200">Silme talebi bekliyor</Badge>}</CardTitle>
              <CardDescription>{c.level} • {c.capacity} kişi • {c.priceCredits} kredi • {c.status}</CardDescription>
              <div className="text-xs text-violet-600 font-medium">📅 {scheduleLabel(c)}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <details>
                <summary className="text-xs font-medium text-violet-600 cursor-pointer flex items-center gap-1"><Pencil size={12} /> Düzenle</summary>
                <form action={updateClass} className="mt-2 space-y-2">
                  <input type="hidden" name="id" value={c.id} />
                  <input name="title" defaultValue={c.title} required className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
                  <textarea name="description" defaultValue={c.description || ""} rows={2} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
                  <input name="priceCredits" type="number" defaultValue={c.priceCredits} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
                  <Button size="sm" type="submit">Kaydet</Button>
                </form>
              </details>
              {!c.deletionRequested && (
                <details>
                  <summary className="text-xs font-medium text-red-600 cursor-pointer flex items-center gap-1"><Trash2 size={12} /> Silme Talebi</summary>
                  <form action={requestClassDeletion} className="mt-2 space-y-2">
                    <input type="hidden" name="id" value={c.id} />
                    <input name="reason" placeholder="Silme nedeni" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
                    <Button size="sm" variant="outline" type="submit">Admin Onayına Gönder</Button>
                  </form>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
        {myClasses.length === 0 && <div className="text-sm text-zinc-500">Henüz sınıfın yok — yukarıdan oluştur.</div>}
      </div>
    </div>
  );
}
