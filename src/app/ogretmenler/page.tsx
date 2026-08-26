import Link from "next/link";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { users, teacherProfiles, classes } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OgretmenlerPublicPage() {
  const teachers = await db
    .select({
      id: users.id,
      name: users.name,
      branches: teacherProfiles.branches,
      bio: teacherProfiles.bioDetail,
      experience: teacherProfiles.experienceYears,
      isVerified: teacherProfiles.isVerified,
      oneOnOne: teacherProfiles.oneOnOnePriceCredits,
      subPrice: teacherProfiles.teacherSubscriptionPriceCredits,
    })
    .from(users)
    .leftJoin(teacherProfiles, eq(teacherProfiles.userId, users.id))
    .where(eq(users.role, "teacher"))
    .limit(50)
    .catch(() => []);

  const classCounts = await db.select({ teacherId: classes.teacherId }).from(classes).where(eq(classes.status, "published")).catch(() => []);
  const countMap = new Map<string, number>();
  for (const c of classCounts) countMap.set(c.teacherId, (countMap.get(c.teacherId) || 0) + 1);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Öğretmenler</h1>
            <p className="text-zinc-400 text-sm">Onaylı öğretmenleri incele, sınıflarına göz at, abone ol veya 1-1 ders talep et.</p>
          </div>
          <Link href="/kesfet"><Button variant="outline" className="bg-white text-[#030712]">Sınıfları Gör</Button></Link>
        </div>

        <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <Card key={t.id} className="bg-white text-zinc-900 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between items-center">{t.name} {t.isVerified && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Onaylı</Badge>}</CardTitle>
                <CardDescription>{(t.branches as string[] | null)?.join(", ") || "Branş belirtilmedi"} • {t.experience || 0} yıl • {countMap.get(t.id) || 0} sınıf</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3">
                <div className="text-sm text-zinc-600 line-clamp-2">{t.bio || "Biyografi yok."}</div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <Badge>{t.oneOnOne || 80} kredi / 1-1</Badge>
                  <Badge>{t.subPrice || 199} kredi / ay abonelik</Badge>
                </div>
                <Link href={`/ogretmenler/${t.id}`} className="mt-auto">
                  <Button className="w-full">Profili ve Sınıfları Gör</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {teachers.length === 0 && <div className="text-sm text-zinc-400">Henüz öğretmen yok.</div>}
        </div>
      </div>
    </div>
  );
}
