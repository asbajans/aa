import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { enrollments, classes, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OgrenciSiniflarimPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "student" && session.user.role !== "superadmin") redirect("/ogretmen");

  const myEnrolls = await db
    .select({ id: enrollments.id, status: enrollments.status, classTitle: classes.title, description: classes.description, teacherName: users.name, teacherId: classes.teacherId, credits: enrollments.creditsPaid })
    .from(enrollments)
    .leftJoin(classes, eq(enrollments.classId, classes.id))
    .leftJoin(users, eq(classes.teacherId, users.id))
    .where(eq(enrollments.studentId, session.user.id))
    .limit(50)
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sınıflarım ({myEnrolls.length})</h1>
          <p className="text-sm text-zinc-600">Başvuruların ve aktif sınıfların. Aktif sınıfların canlı dersleri Programım sayfasında.</p>
        </div>
        <Link href="/kesfet"><Button>Yeni Sınıf Keşfet</Button></Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {myEnrolls.map((e) => (
          <Card key={e.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between items-center">{e.classTitle} <Badge className={e.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : e.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}>{e.status}</Badge></CardTitle>
              <CardDescription>{e.teacherName} • {e.credits} kredi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-zinc-600 line-clamp-2">{e.description || ""}</div>
              <div className="flex gap-2">
                <Link href={`/ogretmenler/${e.teacherId}`}><Button size="sm" variant="outline">Öğretmen Profili</Button></Link>
                <Link href="/ogrenci/program"><Button size="sm" variant="ghost">Program</Button></Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {myEnrolls.length === 0 && (
          <Card className="md:col-span-2"><CardContent className="pt-6 text-sm text-zinc-500 flex items-center gap-2"><GraduationCap size={16} /> Henüz sınıfın yok — <Link href="/kesfet" className="underline font-medium">keşfet</Link>&nbsp;ve başvur.</CardContent></Card>
        )}
      </div>
    </div>
  );
}
