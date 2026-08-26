/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, liveSessions, enrollments, teacherProfiles, users, oneOnOneRequests } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Bot, Wallet, GraduationCap, Calendar, Users, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OgretmenPanel() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") redirect("/ogrenci");

  const profile = (await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, session.user.id)).limit(1).catch(() => []))[0];
  const myClasses = await db.select().from(classes).where(eq(classes.teacherId, session.user.id)).limit(50).catch(() => []);
  const mySessions = await db.select().from(liveSessions).where(eq(liveSessions.teacherId, session.user.id)).orderBy(liveSessions.scheduledAt).limit(5).catch(() => []);
  const pendingCount = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(enrollments)
    .leftJoin(classes, eq(enrollments.classId, classes.id))
    .where(sql`${classes.teacherId} = ${session.user.id} AND ${enrollments.status} = 'pending'`)
    .then((r) => r[0]?.c ?? 0)
    .catch(() => 0);
  const pending1o1 = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(oneOnOneRequests)
    .where(sql`${oneOnOneRequests.teacherId} = ${session.user.id} AND ${oneOnOneRequests.status} = 'pending'`)
    .then((r) => r[0]?.c ?? 0)
    .catch(() => 0);

  const quick = [
    { href: "/ogretmen/siniflar", label: "Sınıflarım", value: myClasses.length, icon: GraduationCap, desc: "oluştur / düzenle" },
    { href: "/ogretmen/canli", label: "Canlı Dersler", value: mySessions.length, icon: Video, desc: "toplu ders aç" },
    { href: "/ogretmen/basvurular", label: "Başvurular", value: pendingCount, icon: Users, desc: "bekleyen" },
    { href: "/ogretmen/talepler", label: "1-1 Talepler", value: pending1o1, icon: Clock, desc: "yeni talep" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Hoş geldin, {session.user.name}</h1>
          <p className="text-zinc-600 text-sm">Soldaki menüden tüm modüllere ulaşabilirsin. Özet aşağıda.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/ogretmen/fiyatlar"><Button variant="outline"><Wallet size={16} className="mr-1" /> Fiyatlar</Button></Link>
          <Link href="/ogretmen/ai-klon"><Button><Bot size={16} className="mr-1" /> Akademi Klonu</Button></Link>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {quick.map((q) => {
          const Icon = q.icon;
          return (
            <Link key={q.href} href={q.href}>
              <Card className="hover:border-zinc-400 transition group">
                <CardContent className="pt-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-2xl font-black text-zinc-900">{q.value}</div>
                      <div className="text-sm font-medium text-zinc-700">{q.label}</div>
                      <div className="text-xs text-zinc-500">{q.desc}</div>
                    </div>
                    <span className="h-9 w-9 grid place-items-center rounded-xl bg-zinc-100 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition"><Icon size={16} /></span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex gap-2 items-center"><Calendar size={16} /> Yaklaşan Dersler</CardTitle><CardDescription>En yakın 5 canlı ders</CardDescription></CardHeader>
          <CardContent>
            {mySessions.length === 0 ? <div className="text-sm text-zinc-500">Planlanmış ders yok — <Link href="/ogretmen/canli" className="underline">canlı ders oluştur</Link>.</div> : (
              <div className="space-y-2">
                {mySessions.map((s) => (
                  <div key={s.id} className="flex justify-between items-center rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm">
                    <div><div className="font-medium text-zinc-900">{s.title}</div><div className="text-xs text-zinc-500">{new Date(s.scheduledAt).toLocaleString("tr-TR")}</div></div>
                    <Link href={`/canli?room=${s.livekitRoom}`}><Button size="sm" variant="outline">Odaya Gir</Button></Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex gap-2 items-center"><Wallet size={16} /> Kazanç Özeti</CardTitle><CardDescription>Canlı %80, Klon %70 (komisyon sonrası)</CardDescription></CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-zinc-900">₺{(profile ? Number((profile as any).totalEarnedTry || 0) : 0).toFixed(2)}</div>
            <div className="text-xs text-zinc-500">Toplam kazanç • Bekleyen: ₺{(profile ? Number((profile as any).pendingTry || 0) : 0).toFixed(2)}</div>
            <div className="mt-3 text-sm text-zinc-600">1-1: <b>{(profile as any)?.oneOnOnePriceCredits || 80} kredi</b> (abonelere {(profile as any)?.subscriberOneOnOnePriceCredits || 60}) • Abonelik: <b>{(profile as any)?.teacherSubscriptionPriceCredits || 199} kredi/ay</b></div>
            <Link href="/ogretmen/fiyatlar" className="text-xs text-violet-600 underline inline-flex items-center gap-1 mt-2">Fiyatları düzenle <ArrowRight size={12} /></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
