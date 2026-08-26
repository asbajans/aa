import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, liveSessions, enrollments, teacherProfiles, categories, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Bot, Wallet, Plus, Calendar, Users, Clock } from "lucide-react";
import { createClass, createLiveSession, updateTeacherPricing, approveEnrollment } from "./actions";

export default async function OgretmenPanel() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") redirect("/ogrenci");

  const cats = await db.select().from(categories).where(eq(categories.isActive, true)).limit(50).catch(() => []);
  const myClasses = await db.select().from(classes).where(eq(classes.teacherId, session.user.id)).orderBy(classes.createdAt).limit(20).catch(() => []);
  const mySessions = await db.select().from(liveSessions).where(eq(liveSessions.teacherId, session.user.id)).orderBy(liveSessions.scheduledAt).limit(10).catch(() => []);
  const profile = (await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, session.user.id)).limit(1).catch(() => []))[0];
  const pendingEnrolls = await db
    .select({ id: enrollments.id, status: enrollments.status, message: enrollments.requestMessage, classTitle: classes.title, studentName: users.name, studentEmail: users.email })
    .from(enrollments)
    .innerJoin(classes, eq(enrollments.classId, classes.id))
    .innerJoin(users, eq(enrollments.studentId, users.id))
    .where(eq(classes.teacherId, session.user.id))
    .limit(20)
    .catch(() => []);

  const pending = pendingEnrolls.filter((e) => e.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Öğretmen Paneli</h1>
          <p className="text-zinc-600 text-sm">Hoş geldin {session.user.name} — sınıf aç, program yap, canlı ders ver, Akademi Klonunu eğit.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/ogretmen/ai-klon"><Button><Bot size={16} className="mr-1" /> Akademi Klonu</Button></Link>
          <Link href="/kesfet"><Button variant="outline">Sınıfları Gör</Button></Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Video size={18} /> Sınıflarım</CardTitle><CardDescription>{myClasses.length} sınıf • max 10 kişi</CardDescription></CardHeader><CardContent><div className="text-2xl font-bold text-zinc-900">{myClasses.length}</div><div className="text-xs text-zinc-500">Aktif sınıfların</div></CardContent></Card>
        <Card className="border-violet-200 bg-violet-50/50"><CardHeader><CardTitle className="flex gap-2 items-center"><Calendar size={18} /> Programım</CardTitle><CardDescription>Haftalık müsaitlik • {profile?.weeklySchedule?.length || 0} slot</CardDescription></CardHeader><CardContent><div className="text-sm text-zinc-700">Saatlik: <b>{profile?.hourlyPriceCredits || 60} kredi</b> • Kayıt: <b>{profile?.enrollmentFeeCredits || 0} kredi</b></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Wallet size={18} /> Kazançlarım</CardTitle><CardDescription>Canlı %80, Akademi Klonu %70</CardDescription></CardHeader><CardContent><div className="text-2xl font-bold text-zinc-900">₺0,00</div><div className="text-xs text-zinc-500">Bekleyen: ₺0 • Min çekim: ₺500</div></CardContent></Card>
      </div>

      {/* Sınıf oluştur */}
      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Plus size={16} /> Yeni Sınıf Oluştur</CardTitle><CardDescription>Başlık, branş, seviye, fiyat (kredi), kontenjan — SüperAdmin tüm sınıfları görür.</CardDescription></CardHeader>
        <CardContent>
          <form action={createClass} className="grid md:grid-cols-2 gap-3">
            <input name="title" placeholder="Sınıf başlığı (örn: LGS Matematik Hız Kampı)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 md:col-span-2" />
            <textarea name="description" placeholder="Açıklama / müfredat kısa özet" rows={2} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 md:col-span-2" />
            <select name="categoryId" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
              <option value="">Branş seç</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.nameTr} ({c.level})</option>)}
            </select>
            <select name="level" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
              <option value="lgs">LGS</option>
              <option value="yks">YKS</option>
              <option value="other">Diğer</option>
            </select>
            <input name="priceCredits" type="number" placeholder="Fiyat kredi (örn: 120)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <input name="capacity" type="number" min={1} max={10} placeholder="Kontenjan (max 10)" defaultValue={10} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <Button type="submit" className="md:col-span-2">Sınıfı Oluştur</Button>
          </form>
        </CardContent>
      </Card>

      {/* Sınıflarım listesi */}
      <Card>
        <CardHeader><CardTitle>Sınıflarım ({myClasses.length})</CardTitle><CardDescription>Öğrenciler seni ve programını burada görür. Kredi ile başvururlar.</CardDescription></CardHeader>
        <CardContent>
          {myClasses.length === 0 ? <div className="text-sm text-zinc-500">Henüz sınıfın yok — yukarıdan oluştur.</div> : (
            <div className="grid md:grid-cols-2 gap-3">
              {myClasses.map((c) => (
                <div key={c.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                  <div className="font-semibold text-zinc-900">{c.title}</div>
                  <div className="text-xs text-zinc-500">{c.level} • {c.capacity} kişi • {c.priceCredits} kredi • {c.status}</div>
                  <div className="mt-2 flex gap-2">
                    <Link href={`/kesfet`}><Button variant="outline" size="sm">Kesfette Gör</Button></Link>
                    <Badge>{c.isAiCloneAllowed ? "Akademi Klonu aktif" : "Klon kapalı"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Canlı ders oluştur */}
      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Video size={18} /> Canlı Ders / 1-1 Ders Aç</CardTitle><CardDescription>Sınıf seç, tarih belirle — öğrenci programında görür, canlı odaya katılır.</CardDescription></CardHeader>
        <CardContent>
          <form action={createLiveSession} className="grid md:grid-cols-3 gap-3">
            <select name="classId" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
              <option value="">Sınıf seç</option>
              {myClasses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input name="title" placeholder="Ders başlığı (örn: Kesirler - Soru Çözümü)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <input name="scheduledAt" type="datetime-local" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <Button type="submit" className="md:col-span-3">Ders Oluştur</Button>
          </form>
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold text-zinc-900">Yaklaşan Derslerim</div>
            {mySessions.length === 0 ? <div className="text-sm text-zinc-500">Henüz ders yok.</div> : mySessions.map((s) => (
              <div key={s.id} className="flex justify-between items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
                <div><div className="font-medium text-zinc-900">{s.title}</div><div className="text-xs text-zinc-500">{new Date(s.scheduledAt).toLocaleString("tr-TR")} • {s.status} • {s.livekitRoom}</div></div>
                <Link href={`/canli?room=${s.livekitRoom}`}><Button size="sm">Odaya Gir</Button></Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fiyat & Program */}
      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Clock size={18} /> Fiyat & Program Ayarları</CardTitle><CardDescription>Saatlik ücret ve kayıt ücreti — öğrenci seni ararken görür. Haftalık programını da buradan ayarla.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <form action={updateTeacherPricing} className="grid md:grid-cols-3 gap-3">
            <div><label className="text-xs text-zinc-500">Saatlik ücret (kredi)</label><input name="hourlyPriceCredits" type="number" defaultValue={profile?.hourlyPriceCredits || 60} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /></div>
            <div><label className="text-xs text-zinc-500">Kayıt ücreti (kredi, 0=ücretsiz başvuru)</label><input name="enrollmentFeeCredits" type="number" defaultValue={profile?.enrollmentFeeCredits || 0} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /></div>
            <div className="flex flex-col gap-1"><label className="text-xs text-zinc-500">Kısa biyografi</label><input name="bioDetail" defaultValue={profile?.bioDetail || ""} placeholder="Örn: LGS'de 10 yıllık deneyim, soru odaklı" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /></div>
            <Button type="submit" className="md:col-span-3">Fiyatları Kaydet</Button>
          </form>
          <div className="text-xs text-zinc-500">Haftalık program için yakında takvim editörü eklenecek — şu an canlı derslerin program olarak görünüyor.</div>
        </CardContent>
      </Card>

      {/* Başvurular */}
      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Users size={18} /> Öğrenci Başvuruları {pending.length ? <Badge className="bg-amber-500 text-white">{pending.length} bekleyen</Badge> : null}</CardTitle><CardDescription>Öğrenciler sınıflarına başvurur — onayla ve kredileri düş, reddet.</CardDescription></CardHeader>
        <CardContent>
          {pendingEnrolls.length === 0 ? <div className="text-sm text-zinc-500">Henüz başvuru yok.</div> : (
            <div className="space-y-2">
              {pendingEnrolls.map((e) => (
                <div key={e.id} className="flex flex-wrap justify-between items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3">
                  <div>
                    <div className="font-medium text-zinc-900">{e.studentName} <span className="text-xs text-zinc-500">({e.studentEmail})</span></div>
                    <div className="text-sm text-zinc-700">{e.classTitle} • {e.status} {e.message ? `• "${e.message}"` : ""}</div>
                  </div>
                  {e.status === "pending" ? (
                    <div className="flex gap-2">
                      <form action={async () => { "use server"; await approveEnrollment(e.id, true); }}><Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Onayla</Button></form>
                      <form action={async () => { "use server"; await approveEnrollment(e.id, false); }}><Button size="sm" variant="outline">Reddet</Button></form>
                    </div>
                  ) : <Badge>{e.status}</Badge>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
