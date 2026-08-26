/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { classes, categories, users, teacherProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { enrollToClass } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function KesfetPage() {
  let allClasses: any[] = [];
  try {
    allClasses = await db
      .select({
        id: classes.id,
        title: classes.title,
        description: classes.description,
        priceCredits: classes.priceCredits,
        level: classes.level,
        capacity: classes.capacity,
        status: classes.status,
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
      .limit(24);
  } catch {
    allClasses = [];
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Sınıfları Keşfet — LGS & YKS</h1>
            <p className="text-zinc-400 text-sm">Sınıf seç, öğretmenin programını gör, kredi ile başvur. Öğretmen onaylayınca canlı derslere katıl.</p>
          </div>
          <Link href="/paketler"><Button variant="outline" className="bg-white text-[#030712]">Paket Al</Button></Link>
        </div>

        {allClasses.length === 0 ? (
          <Card className="mt-6 bg-white text-zinc-900"><CardContent className="pt-6 text-sm text-zinc-600">Henüz sınıf yok. Öğretmenler sınıf oluşturduğunda burada görünecek.</CardContent></Card>
        ) : (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {allClasses.map((c) => (
              <Card key={c.id} className="bg-white text-zinc-900 flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base line-clamp-2">{c.title}</CardTitle>
                  <CardDescription>{c.categoryName} • {c.level} • {c.teacherName} {c.hourlyPrice ? `• ${c.hourlyPrice} kredi/saat` : ""}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <div className="text-sm text-zinc-600 line-clamp-2">{c.description || "Müfredat yakında"}</div>
                  <div className="flex items-center gap-2 text-xs"><Badge>{c.capacity} kişi</Badge><Badge>{c.priceCredits} kredi</Badge><Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Akademi Klonu</Badge></div>
                  <form action={enrollToClass} className="mt-auto space-y-2">
                    <input type="hidden" name="classId" value={c.id} />
                    <input name="message" placeholder="Öğretmene mesaj (opsiyonel)" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400" />
                    <Button type="submit" className="w-full">Başvur — {c.priceCredits} kredi</Button>
                  </form>
                  <Link href={`/ogretmenler/${c.teacherId}`} className="text-xs text-violet-600 underline text-center">Öğretmen profilini gör</Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-400">
          <b className="text-white">Nasıl çalışır?</b> 1) Paket al → kredi yüklenir 2) Sınıfa başvur → öğretmen onaylar 3) Kredi düşer, canlı ders programı görünür 4) Akademi Klonunla 7/24 pratik.
        </div>
      </div>
    </div>
  );
}
