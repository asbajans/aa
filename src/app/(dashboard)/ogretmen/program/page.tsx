import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { teacherProfiles, liveSessions, classes } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { updateWeeklySchedule } from "../actions";
import { ScheduleEditor } from "./ScheduleEditor";

export const dynamic = "force-dynamic";

export default async function OgretmenProgramPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") redirect("/ogrenci");

  const profile = (await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, session.user.id)).limit(1).catch(() => []))[0];
  const schedule = (profile?.weeklySchedule as any[] | null) || [];
  const upcoming = await db.select({ id: liveSessions.id, title: liveSessions.title, scheduledAt: liveSessions.scheduledAt, status: liveSessions.status, classTitle: classes.title }).from(liveSessions).leftJoin(classes, eq(liveSessions.classId, classes.id)).where(eq(liveSessions.teacherId, session.user.id)).orderBy(liveSessions.scheduledAt).limit(20).catch(() => []);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Programım</h1>
        <p className="text-sm text-zinc-600">Haftalık müsait saatlerini belirle — öğrenciler profilinde görür. Canlı derslerin de otomatik programda görünür.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Calendar size={16} /> Haftalık Müsaitlik</CardTitle><CardDescription>Gün + saat aralığı ekle (örn: Pazartesi 18:00-21:00)</CardDescription></CardHeader>
        <CardContent>
          <ScheduleEditor initial={schedule} action={updateWeeklySchedule} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Clock size={16} /> Planlanan Dersler</CardTitle></CardHeader>
        <CardContent>
          {upcoming.length === 0 ? <div className="text-sm text-zinc-500">Henüz planlanmış ders yok.</div> : (
            <div className="space-y-2">
              {upcoming.map((s) => (
                <div key={s.id} className="flex justify-between items-center rounded-xl border border-zinc-200 bg-white p-3">
                  <div><div className="font-medium text-zinc-900">{s.title}</div><div className="text-xs text-zinc-500">{s.classTitle} • {new Date(s.scheduledAt).toLocaleString("tr-TR")}</div></div>
                  <Badge>{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
