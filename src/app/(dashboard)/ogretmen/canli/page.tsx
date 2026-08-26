import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { classes, liveSessions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Trash2 } from "lucide-react";
import { createLiveSession, requestLiveSessionDeletion } from "../actions";

export const dynamic = "force-dynamic";

export default async function OgretmenCanliPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") redirect("/ogrenci");

  const myClasses = await db.select().from(classes).where(eq(classes.teacherId, session.user.id)).limit(50).catch(() => []);
  const mySessions = await db.select().from(liveSessions).where(eq(liveSessions.teacherId, session.user.id)).orderBy(liveSessions.scheduledAt).limit(50).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Canlı Dersler</h1>
        <p className="text-sm text-zinc-600">Sınıfına toplu canlı ders ekle — abone öğrenciler programında görür ve katılır (max 10 kişi).</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Video size={16} /> Yeni Canlı Ders</CardTitle><CardDescription>Sınıf seç, başlık ve tarih belirle. Ders sınıf aboneliğine dahildir.</CardDescription></CardHeader>
        <CardContent>
          {myClasses.length === 0 ? <div className="text-sm text-zinc-500">Önce <Link href="/ogretmen/siniflar" className="underline">sınıf oluştur</Link>.</div> : (
            <form action={createLiveSession} className="grid md:grid-cols-3 gap-3">
              <select name="classId" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
                <option value="">Sınıf seç</option>
                {myClasses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
              <input name="title" placeholder="Ders başlığı (örn: Kesirler Soru Çözümü)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
              <input name="scheduledAt" type="datetime-local" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
              <Button type="submit" className="md:col-span-3">Ders Oluştur</Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Tüm Canlı Derslerim ({mySessions.length})</CardTitle><CardDescription>Silme talepleri SuperAdmin onayına gider.</CardDescription></CardHeader>
        <CardContent>
          {mySessions.length === 0 ? <div className="text-sm text-zinc-500">Henüz canlı ders yok.</div> : (
            <div className="space-y-2">
              {mySessions.map((s) => (
                <div key={s.id} className={`flex flex-wrap justify-between items-center gap-2 rounded-xl border p-3 ${s.deletionRequested ? "border-red-200 bg-red-50/40" : "border-zinc-200 bg-white"}`}>
                  <div>
                    <div className="font-medium text-zinc-900">{s.title} {s.deletionRequested && <Badge className="bg-red-100 text-red-700 border-red-200 ml-1">Silme talebi bekliyor</Badge>}</div>
                    <div className="text-xs text-zinc-500">{new Date(s.scheduledAt).toLocaleString("tr-TR")} • {s.status} • oda: {s.livekitRoom}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/canli?room=${s.livekitRoom}`}><Button size="sm">Odaya Gir</Button></Link>
                    {!s.deletionRequested && (
                      <form action={requestLiveSessionDeletion}>
                        <input type="hidden" name="id" value={s.id} />
                        <Button size="sm" variant="ghost" className="text-red-600" type="submit"><Trash2 size={14} /> Silme Talebi</Button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
