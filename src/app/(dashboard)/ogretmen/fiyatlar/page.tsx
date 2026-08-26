/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { teacherProfiles } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OgretmenFiyatlarPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || (session.user.role !== "teacher" && session.user.role !== "superadmin")) redirect("/giris");

  const profile = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, session.user.id)).limit(1).then((r) => r[0]).catch(() => null);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Fiyatlar & Abonelik Ayarları</h1>
        <p className="text-sm text-zinc-600">Abonelik, 1-1 ders ve klon ücretlerini ayrı ayrı belirle. Abonelere özel indirimli fiyatlar da ayarlayabilirsin.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Genel Fiyatlar</CardTitle><CardDescription>Öğrenciler seni ararken bu fiyatları görür. SüperAdmin de görüp düzenleyebilir.</CardDescription></CardHeader>
        <CardContent>
          <form action={async (fd: FormData) => {
            "use server";
            const { updateTeacherPricing } = await import("../actions");
            await updateTeacherPricing(fd);
          }} className="grid md:grid-cols-2 gap-4">
            <div><label className="text-xs text-zinc-500">Öğretmen Aboneliği (kredi/ay)</label><input name="teacherSubscriptionPriceCredits" type="number" defaultValue={profile?.teacherSubscriptionPriceCredits || 199} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /><div className="text-xs text-zinc-400 mt-1">Aboneler klonundan {profile?.cloneAccessLimit || 50} sorgu/ay faydalanır</div></div>
            <div><label className="text-xs text-zinc-500">Klon Aylık Limit (sorgu)</label><input name="cloneAccessLimit" type="number" defaultValue={profile?.cloneAccessLimit || 50} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /></div>
            <div><label className="text-xs text-zinc-500">1-1 Ders (kredi/saat) — normal</label><input name="oneOnOnePriceCredits" type="number" defaultValue={profile?.oneOnOnePriceCredits || 80} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /></div>
            <div><label className="text-xs text-zinc-500">1-1 Ders — Abonelere Özel (kredi/saat)</label><input name="subscriberOneOnOnePriceCredits" type="number" defaultValue={(profile as any)?.subscriberOneOnOnePriceCredits || 60} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /><div className="text-xs text-zinc-400 mt-1">Abonelerine indirimli</div></div>
            <div><label className="text-xs text-zinc-500">Klon (kredi/dk) — normal</label><input name="subscriberClonePriceCredits" type="number" defaultValue={(profile as any)?.subscriberClonePriceCredits || 1} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /><div className="text-xs text-zinc-400 mt-1">Abonelere klon dk fiyatı (normal 2)</div></div>
            <div><label className="text-xs text-zinc-500">Saatlik (eski alan)</label><input name="hourlyPriceCredits" type="number" defaultValue={profile?.hourlyPriceCredits || 60} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /></div>
            <div className="md:col-span-2"><label className="text-xs text-zinc-500">Biyografi</label><textarea name="bioDetail" defaultValue={profile?.bioDetail || ""} placeholder="Örn: LGS'de 10 yıllık deneyim, soru odaklı anlatım" rows={3} className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" /></div>
            <Button type="submit" className="md:col-span-2">Kaydet</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6 text-sm text-amber-800">
          <b>Not:</b> Sınıf fiyatı her sınıf oluştururken ayrı belirlenir ve o sınıfın toplu canlı dersleri aboneliğe dahildir. 1-1 dersler ayrı ücrete tabidir ve öğrenci onayladığında kredi düşer.
        </CardContent>
      </Card>
    </div>
  );
}
