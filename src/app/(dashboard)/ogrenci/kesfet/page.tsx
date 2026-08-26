import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { classes, categories, users, teacherProfiles, enrollments } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { enrollToClass } from "@/app/kesfet/actions";
import { scheduleLabel } from "@/lib/schedule";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OgrenciKesfetPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "student" && session.user.role !== "superadmin") redirect("/ogretmen");

  const allClasses = await db
    .select({
      id: classes.id,
      title: classes.title,
      description: classes.description,
      priceCredits: classes.priceCredits,
      level: classes.level,
      capacity: classes.capacity,
      scheduleType: classes.scheduleType,
      scheduleDays: classes.scheduleDays,
      scheduleMonthDays: classes.scheduleMonthDays,
      scheduleTime: classes.scheduleTime,
      teacherName: users.name,
      teacherId: classes.teacherId,
      categoryName: categories.nameTr,
      hourlyPrice: teacherProfiles.hourlyPriceCredits,
    })
    .from(classes)
    .leftJoin(users, eq(classes.teacherId, users.id))
    .leftJoin(categories, eq(classes.categoryId, categories.id))
    .leftJoin(teacherProfiles, eq(teacherProfiles.userId, classes.teacherId))
    .where(eq(classes.status, "published"))
    .limit(48)
    .catch(() => []);

  const myEnrolls = await db.select({ classId: enrollments.classId, status: enrollments.status }).from(enrollments).where(eq(enrollments.studentId, session.user.id)).catch(() => []);
  const enrolledMap = new Map(myEnrolls.map((e) => [e.classId, e.status]));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sınıfları Keşfet</h1>
          <p className="text-sm text-zinc-600">Sınıfa başvur → öğretmen onaylar → canlı dersler Programım&apos;da görünür (aboneliğe dahil).</p>
        </div>
        <Link href="/ogrenci/ogretmenler"><Button variant="outline">Öğretmenleri Gör</Button></Link>
      </div>

      {allClasses.length === 0 ? (
        <Card><CardContent className="pt-6 text-sm text-zinc-500">Henüz yayınlanmış sınıf yok.</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allClasses.map((c) => {
            const myStatus = enrolledMap.get(c.id);
            return (
              <Card key={c.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2">{c.title}</CardTitle>
                  <CardDescription>{c.categoryName} • {c.level} • {c.teacherName}{c.hourlyPrice ? ` • ${c.hourlyPrice} kredi/saat` : ""}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <div className="text-sm text-zinc-600 line-clamp-2">{c.description || "Müfredat yakında"}</div>
                  <div className="text-xs text-violet-700 font-medium">📅 {scheduleLabel(c)}</div>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <Badge>{c.capacity} kişi</Badge>
                    <Badge>{c.priceCredits} kredi</Badge>
                    <Badge className="bg-violet-50 text-violet-700 border-violet-200">Akademi Klonu</Badge>
                  </div>
                  {myStatus ? (
                    <Badge className={myStatus === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200 mt-auto" : "bg-amber-50 text-amber-700 border-amber-200 mt-auto"}>Başvurun: {myStatus}</Badge>
                  ) : (
                    <form action={enrollToClass} className="mt-auto space-y-2">
                      <input type="hidden" name="classId" value={c.id} />
                      <input name="message" placeholder="Öğretmene mesaj (opsiyonel)" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400" />
                      <Button type="submit" className="w-full">Başvur — {c.priceCredits} kredi</Button>
                    </form>
                  )}
                  <Link href={`/ogretmenler/${c.teacherId}`} className="text-xs text-violet-600 underline text-center">Öğretmen profilini gör</Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
