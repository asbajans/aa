import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { enrollments, classes, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { EnrollActions } from "./EnrollActions";

export const dynamic = "force-dynamic";

export default async function OgretmenBasvurularPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") redirect("/ogrenci");

  const all = await db
    .select({ id: enrollments.id, status: enrollments.status, message: enrollments.requestMessage, credits: enrollments.creditsPaid, classTitle: classes.title, studentName: users.name, studentEmail: users.email, enrolledAt: enrollments.enrolledAt })
    .from(enrollments)
    .innerJoin(classes, eq(enrollments.classId, classes.id))
    .innerJoin(users, eq(enrollments.studentId, users.id))
    .where(eq(classes.teacherId, session.user.id))
    .orderBy(enrollments.enrolledAt)
    .limit(50)
    .catch(() => []);

  const pending = all.filter((e) => e.status === "pending");
  const others = all.filter((e) => e.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sınıf Başvuruları</h1>
        <p className="text-sm text-zinc-600">Onayladığında öğrenciden sınıf ücreti kadar kredi düşer ve hakedişin pending olarak oluşur.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex gap-2 items-center"><Users size={16} /> Bekleyen Başvurular {pending.length ? <Badge className="bg-amber-500 text-white">{pending.length}</Badge> : null}</CardTitle></CardHeader>
        <CardContent>
          {pending.length === 0 ? <div className="text-sm text-zinc-500">Bekleyen başvuru yok.</div> : (
            <div className="space-y-2">
              {pending.map((e) => (
                <div key={e.id} className="flex flex-wrap justify-between items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/40 p-3">
                  <div>
                    <div className="font-medium text-zinc-900">{e.studentName} <span className="text-xs text-zinc-500">({e.studentEmail})</span></div>
                    <div className="text-sm text-zinc-700">{e.classTitle} • {e.credits} kredi {e.message ? `• "${e.message}"` : ""}</div>
                    <div className="text-xs text-zinc-400">{new Date(e.enrolledAt).toLocaleString("tr-TR")}</div>
                  </div>
                  <EnrollActions enrollmentId={e.id} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Geçmiş ({others.length})</CardTitle></CardHeader>
        <CardContent>
          {others.length === 0 ? <div className="text-sm text-zinc-500">Kayıt yok.</div> : (
            <div className="space-y-2">
              {others.map((e) => (
                <div key={e.id} className="flex justify-between items-center rounded-xl border border-zinc-200 bg-white p-3">
                  <div><div className="font-medium text-zinc-900">{e.studentName}</div><div className="text-xs text-zinc-500">{e.classTitle} • {new Date(e.enrolledAt).toLocaleDateString("tr-TR")}</div></div>
                  <Badge className={e.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}>{e.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
