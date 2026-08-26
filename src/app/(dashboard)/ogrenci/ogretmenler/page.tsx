import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { users, teacherProfiles } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OgrenciOgretmenlerPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "student" && session.user.role !== "superadmin") redirect("/ogretmen");

  const teachers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      branches: teacherProfiles.branches,
      bio: teacherProfiles.bioDetail,
      experience: teacherProfiles.experienceYears,
      isVerified: teacherProfiles.isVerified,
      oneOnOne: teacherProfiles.oneOnOnePriceCredits,
      subPrice: teacherProfiles.teacherSubscriptionPriceCredits,
      cloneLimit: teacherProfiles.cloneAccessLimit,
    })
    .from(users)
    .leftJoin(teacherProfiles, eq(teacherProfiles.userId, users.id))
    .where(eq(users.role, "teacher"))
    .limit(50)
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Öğretmenler</h1>
          <p className="text-sm text-zinc-600">Öğretmenleri incele, abone ol (klon erişimi) veya 1-1 ders talebi gönder.</p>
        </div>
        <Link href="/ogrenci/kesfet"><Button variant="outline">Sınıfları Gör</Button></Link>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <Card key={t.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between items-center">{t.name} {t.isVerified && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Onaylı</Badge>}</CardTitle>
              <CardDescription>{(t.branches as string[] | null)?.join(", ") || "Branş belirtilmedi"} • {t.experience || 0} yıl</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <div className="text-sm text-zinc-600 line-clamp-2">{t.bio || "Biyografi yok."}</div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <Badge>{t.oneOnOne || 80} kredi / 1-1</Badge>
                <Badge>{t.subPrice || 199} kredi / ay</Badge>
                <Badge className="bg-violet-50 text-violet-700 border-violet-200">Klon {t.cloneLimit || 50}/ay</Badge>
              </div>
              <Link href={`/ogretmenler/${t.id}`} className="mt-auto">
                <Button className="w-full">Profili Gör — Abone Ol / 1-1 Talep</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        {teachers.length === 0 && <div className="text-sm text-zinc-500">Henüz öğretmen yok.</div>}
      </div>
    </div>
  );
}
