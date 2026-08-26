import { db } from "@/lib/db";
import { users, teacherProfiles, classes, categories, liveSessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OgretmenPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = await db.select().from(users).where(eq(users.id, id)).limit(1).then((r) => r[0]).catch(() => null);
  if (!teacher || (teacher.role !== "teacher" && teacher.role !== "superadmin")) return notFound();
  const profile = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, id)).limit(1).then((r) => r[0]).catch(() => null);
  const myClasses = await db.select({ id: classes.id, title: classes.title, priceCredits: classes.priceCredits, level: classes.level, categoryName: categories.nameTr }).from(classes).leftJoin(categories, eq(classes.categoryId, categories.id)).where(eq(classes.teacherId, id)).limit(12).catch(() => []);
  const upcoming = await db.select().from(liveSessions).where(eq(liveSessions.teacherId, id)).orderBy(liveSessions.scheduledAt).limit(6).catch(() => []);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/kesfet" className="text-sm text-zinc-400 hover:text-white">← Sınıflara dön</Link>
        <Card className="mt-4 bg-white text-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl">{teacher.name}</CardTitle>
            <CardDescription>{profile?.branches?.join(", ") || "Branş belirtilmedi"} • {profile?.experienceYears || 0} yıl deneyim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-zinc-700 whitespace-pre-wrap">{profile?.bioDetail || "Öğretmen henüz biyografi eklemedi."}</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge>{profile?.oneOnOnePriceCredits || profile?.hourlyPriceCredits || 80} kredi / 1-1 saat</Badge>
              <Badge>{profile?.teacherSubscriptionPriceCredits || 199} kredi / ay abonelik</Badge>
              <Badge className="bg-violet-50 text-violet-700 border-violet-200">Klon: {profile?.cloneAccessLimit || 50}/ay</Badge>
              {profile?.isVerified && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Onaylı</Badge>}
            </div>
            <div className="text-xs text-zinc-500">E-posta: {teacher.email}</div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Card className="bg-white text-zinc-900">
            <CardHeader><CardTitle className="text-base">Öğretmene Abone Ol</CardTitle><CardDescription>{profile?.teacherSubscriptionPriceCredits || 199} kredi / ay • Klon {profile?.cloneAccessLimit || 50} sorgu/ay dahil</CardDescription></CardHeader>
            <CardContent>
              <form action={async (fd: FormData) => { "use server"; const { subscribeToTeacher } = await import("./actions"); await subscribeToTeacher(fd); }}>
                <input type="hidden" name="teacherId" value={id} />
                <Button type="submit" className="w-full">Abone Ol — {profile?.teacherSubscriptionPriceCredits || 199} kredi</Button>
              </form>
              <div className="text-xs text-zinc-500 mt-2">Abonelik: öğretmenin Akademi Klonundan sınırlı sayıda faydalanma hakkı verir.</div>
            </CardContent>
          </Card>
          <Card className="bg-white text-zinc-900">
            <CardHeader><CardTitle className="text-base">1-1 Ders Talebi</CardTitle><CardDescription>{profile?.oneOnOnePriceCredits || 80} kredi / 60dk • Öğretmen tarih önerir, sen onaylayınca kredi düşer</CardDescription></CardHeader>
            <CardContent>
              <form action={async (fd: FormData) => { "use server"; const { requestOneOnOne } = await import("./actions"); await requestOneOnOne(fd); }} className="space-y-2">
                <input type="hidden" name="teacherId" value={id} />
                <textarea name="message" placeholder="Hangi konuda 1-1 istersin? (örn: Türev soru çözümü)" rows={2} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
                <Button type="submit" className="w-full">1-1 Talep Gönder</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-white">Sınıfları ({myClasses.length})</h2>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {myClasses.map((c) => (
              <Card key={c.id} className="bg-white text-zinc-900"><CardHeader className="pb-2"><CardTitle className="text-base">{c.title}</CardTitle><CardDescription>{c.categoryName} • {c.level} • {c.priceCredits} kredi</CardDescription></CardHeader><CardContent><Link href="/kesfet"><Button size="sm" className="w-full">Başvur</Button></Link></CardContent></Card>
            ))}
            {myClasses.length === 0 && <div className="text-sm text-zinc-400">Henüz sınıf yok.</div>}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-white">Yaklaşan Ders Programı</h2>
          <div className="mt-3 space-y-2">
            {upcoming.length === 0 ? <div className="text-sm text-zinc-400">Program henüz oluşturulmadı.</div> : upcoming.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 flex justify-between items-center">
                <div><div className="font-medium text-white">{s.title}</div><div className="text-xs text-zinc-400">{new Date(s.scheduledAt).toLocaleString("tr-TR")}</div></div>
                <Badge>{s.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
