import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { liveSessions, classes, enrollments, oneOnOneRequests, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Video } from "lucide-react";
import { confirmOneOnOne } from "@/app/ogretmenler/[id]/actions";

export const dynamic = "force-dynamic";

export default async function OgrenciProgramPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "student" && session.user.role !== "superadmin") redirect("/ogretmen");

  const upcoming = await db
    .select({ id: liveSessions.id, title: liveSessions.title, scheduledAt: liveSessions.scheduledAt, room: liveSessions.livekitRoom, classTitle: classes.title, teacherName: users.name })
    .from(liveSessions)
    .leftJoin(enrollments, eq(enrollments.classId, liveSessions.classId))
    .leftJoin(classes, eq(liveSessions.classId, classes.id))
    .leftJoin(users, eq(classes.teacherId, users.id))
    .where(eq(enrollments.studentId, session.user.id))
    .orderBy(liveSessions.scheduledAt)
    .limit(30)
    .catch(() => []);

  const oneOnOnes = await db.select().from(oneOnOneRequests).where(eq(oneOnOneRequests.studentId, session.user.id)).orderBy(oneOnOneRequests.createdAt).limit(20).catch(() => []);
  const teacherRows = oneOnOnes.length ? await db.select({ id: users.id, name: users.name }).from(users).catch(() => []) : [];
  const nameOf = (tid: string) => teacherRows.find((t) => t.id === tid)?.name || "Öğretmen";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Programım</h1>
        <p className="text-sm text-zinc-600">Aktif sınıflarının canlı dersleri (aboneliğe dahil) + 1-1 derslerin.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Video size={16} /> Canlı Dersler ({upcoming.length})</CardTitle><CardDescription>Sınıf aboneliğine dahil — ek ücret yok</CardDescription></CardHeader>
        <CardContent>
          {upcoming.length === 0 ? <div className="text-sm text-zinc-500">Henüz ders yok — <Link href="/kesfet" className="underline">sınıfa başvur</Link>, öğretmen program oluşturunca burada görünür.</div> : (
            <div className="space-y-2">
              {upcoming.map((s) => (
                <div key={s.id} className="flex flex-wrap justify-between items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3">
                  <div>
                    <div className="font-medium text-zinc-900">{s.title} <span className="text-xs text-zinc-500">({s.classTitle} • {s.teacherName})</span></div>
                    <div className="text-xs text-zinc-500">{new Date(s.scheduledAt).toLocaleString("tr-TR")}</div>
                  </div>
                  <Link href={`/canli?room=${s.room}`}><Button size="sm">Katıl</Button></Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Clock size={16} /> 1-1 Derslerim</CardTitle><CardDescription>Öğretmen tarih önerir, sen onaylayınca kredi düşer</CardDescription></CardHeader>
        <CardContent>
          {oneOnOnes.length === 0 ? <div className="text-sm text-zinc-500">Henüz 1-1 talebin yok — öğretmen profilinden talep gönderebilirsin.</div> : (
            <div className="space-y-2">
              {oneOnOnes.map((r) => (
                <div key={r.id} className="flex flex-wrap justify-between items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3">
                  <div>
                    <div className="font-medium text-zinc-900">{nameOf(r.teacherId)} • {r.status} • {r.priceCredits} kredi • {r.durationMinutes}dk</div>
                    <div className="text-xs text-zinc-500">{r.message || ""} {r.proposedTime ? `• Önerilen: ${new Date(r.proposedTime).toLocaleString("tr-TR")}` : ""}</div>
                  </div>
                  {r.status === "proposed" && (
                    <form action={async (fd: FormData) => { "use server"; await confirmOneOnOne(fd); }}>
                      <input type="hidden" name="id" value={r.id} />
                      <Button size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700">Onayla ve Öde — {r.priceCredits} kredi</Button>
                    </form>
                  )}
                  {r.status === "confirmed" && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Onaylandı</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
