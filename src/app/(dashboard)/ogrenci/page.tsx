import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { enrollments, classes, liveSessions, userCredits, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Bot, BookOpen, Clock, User } from "lucide-react";
import { teacherSubscriptions, oneOnOneRequests } from "@/lib/db/schema";

export default async function OgrenciPanel() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "student" && session.user.role !== "superadmin") redirect("/ogretmen");

  const myEnrolls = await db
    .select({ id: enrollments.id, status: enrollments.status, classTitle: classes.title, classId: classes.id, teacherName: users.name })
    .from(enrollments)
    .leftJoin(classes, eq(enrollments.classId, classes.id))
    .leftJoin(users, eq(classes.teacherId, users.id))
    .where(eq(enrollments.studentId, session.user.id))
    .limit(20)
    .catch(() => []);

  const upcoming = await db
    .select({ id: liveSessions.id, title: liveSessions.title, scheduledAt: liveSessions.scheduledAt, room: liveSessions.livekitRoom, classTitle: classes.title })
    .from(liveSessions)
    .leftJoin(enrollments, eq(enrollments.classId, liveSessions.classId))
    .leftJoin(classes, eq(liveSessions.classId, classes.id))
    .where(eq(enrollments.studentId, session.user.id))
    .orderBy(liveSessions.scheduledAt)
    .limit(6)
    .catch(() => []);

  const credit = await db.select().from(userCredits).where(eq(userCredits.userId, session.user.id)).limit(1).then((r) => r[0]).catch(() => null);
  const subs = await db.select({ id: teacherSubscriptions.id, status: teacherSubscriptions.status, teacherName: users.name, pricePaid: teacherSubscriptions.pricePaid }).from(teacherSubscriptions).leftJoin(users, eq(teacherSubscriptions.teacherId, users.id)).where(eq(teacherSubscriptions.studentId, session.user.id)).limit(10).catch(() => []);
  const oneOnOnes = await db.select().from(oneOnOneRequests).where(eq(oneOnOneRequests.studentId, session.user.id)).orderBy(oneOnOneRequests.createdAt).limit(10).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Öğrenci Paneli</h1>
        <p className="text-zinc-600 text-sm">Hoş geldin {session.user.name} — başvuruların, derslerin ve Akademi Klonun burada.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><BookOpen size={18} /> Kredi Bakiyem</CardTitle><CardDescription>Paket al, derslere harca</CardDescription></CardHeader><CardContent><div className="text-2xl font-black text-zinc-900">{credit?.balance ?? 0} kredi</div><Link href="/ogrenci/krediler"><Button variant="outline" size="sm" className="mt-2">Kredi Detayı</Button></Link></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Video size={18} /> Başvurularım</CardTitle><CardDescription>{myEnrolls.filter((e) => e.status === "pending").length} bekleyen • {myEnrolls.filter((e) => e.status === "active").length} aktif</CardDescription></CardHeader><CardContent><Link href="/ogrenci/kesfet"><Button className="w-full">Sınıf Keşfet</Button></Link></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Bot size={18} /> Akademi Klonum</CardTitle><CardDescription>7/24 soru çözümü</CardDescription></CardHeader><CardContent><Link href="/ogrenci/ogretmenler"><Button variant="outline" className="w-full">Öğretmen Seç</Button></Link></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><BookOpen size={18} /> Sınıflarım ({myEnrolls.length})</CardTitle><CardDescription>Başvuru durumun — öğretmen onaylayınca aktif olur ve kredi düşer.</CardDescription></CardHeader>
        <CardContent>
          {myEnrolls.length === 0 ? <div className="text-sm text-zinc-500">Henüz başvurun yok — <Link href="/ogrenci/kesfet" className="underline">keşfet</Link> ve başvur.</div> : (
            <div className="space-y-2">
              {myEnrolls.map((e) => (
                <div key={e.id} className="flex justify-between items-center rounded-xl border border-zinc-200 bg-white p-3">
                  <div><div className="font-medium text-zinc-900">{e.classTitle}</div><div className="text-xs text-zinc-500">{e.teacherName} • {e.status}</div></div>
                  <Badge className={e.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : e.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}>{e.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Clock size={16} /> Yaklaşan Derslerim</CardTitle><CardDescription>Öğretmeninin programı — canlı odaya katıl (sınıf aboneliğine dahil)</CardDescription></CardHeader>
        <CardContent>
          {upcoming.length === 0 ? <div className="text-sm text-zinc-500">Henüz ders yok — öğretmen program oluşturduğunda burada görünecek. Sınıf aboneliğindeki toplu canlı dersler ücrete dahildir.</div> : (
            <div className="space-y-2">
              {upcoming.map((s) => (
                <div key={s.id} className="flex justify-between items-center rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div><div className="font-medium text-zinc-900">{s.title} <span className="text-xs text-zinc-500">({s.classTitle})</span></div><div className="text-xs text-zinc-500">{new Date(s.scheduledAt).toLocaleString("tr-TR")}</div></div>
                  <Link href={`/canli?room=${s.room}`}><Button size="sm">Katıl</Button></Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex gap-2 items-center"><User size={16} /> Aboneliklerim</CardTitle><CardDescription>Öğretmene abonelik — Akademi Klonu sınırlı erişim</CardDescription></CardHeader>
          <CardContent>
            {subs.length === 0 ? <div className="text-sm text-zinc-500">Henüz aboneliğin yok — <Link href="/ogrenci/ogretmenler" className="underline">öğretmen keşfet</Link> ve abone ol.</div> : subs.map((s) => (
              <div key={s.id} className="flex justify-between items-center rounded-xl border border-zinc-200 bg-white p-3 mb-2">
                <div><div className="font-medium text-zinc-900">{s.teacherName}</div><div className="text-xs text-zinc-500">{s.status} • {s.pricePaid} kredi</div></div>
                <Badge>{s.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>1-1 Taleplerim</CardTitle><CardDescription>Öğretmen tarih önerir, sen onaylayınca kredi düşer</CardDescription></CardHeader>
          <CardContent>
            {oneOnOnes.length === 0 ? <div className="text-sm text-zinc-500">Henüz 1-1 talebin yok.</div> : (
              <div className="space-y-2">
                {oneOnOnes.map((r) => (
                  <div key={r.id} className="rounded-xl border border-zinc-200 bg-white p-3">
                    <div className="text-sm font-medium text-zinc-900">{r.status} • {r.priceCredits} kredi • {r.durationMinutes}dk</div>
                    <div className="text-xs text-zinc-500">{r.message || ""} {r.proposedTime ? `• Önerilen: ${new Date(r.proposedTime).toLocaleString("tr-TR")}` : ""}</div>
                    {r.status === "proposed" && (
                      <form action={async (fd: FormData) => { "use server"; const { confirmOneOnOne } = await import("@/app/ogretmenler/[id]/actions"); await confirmOneOnOne(fd); }}>
                        <input type="hidden" name="id" value={r.id} />
                        <Button size="sm" type="submit" className="mt-2 w-full">Onayla ve Öde — {r.priceCredits} kredi</Button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
