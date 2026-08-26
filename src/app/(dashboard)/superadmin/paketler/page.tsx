import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPackage, togglePackageActive, deletePackage, setPackageFeatured } from "./actions";
import Link from "next/link";

export default async function SuperAdminPaketlerPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || session.user.role !== "superadmin") redirect("/giris");

  const allPackages = await db.select().from(packages).orderBy(packages.credits);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Paket Yönetimi</h1>
          <p className="text-sm text-zinc-600">SaaS paketlerini oluştur, fiyat ve kredi miktarını belirle. Öğrenciler <Link href="/paketler" className="underline">/paketler</Link> sayfasından görür.</p>
        </div>
        <Link href="/superadmin"><Button variant="outline">← SüperAdmin</Button></Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Yeni Paket Oluştur</CardTitle></CardHeader>
        <CardContent>
          <form action={createPackage} className="grid md:grid-cols-3 gap-3">
            <input name="nameTr" placeholder="Paket adı (örn: Premium)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <input name="credits" type="number" placeholder="Kredi (örn: 500)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <input name="bonusCredits" type="number" placeholder="Bonus kredi (örn: 50)" className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <input name="priceTry" placeholder="Fiyat TL (örn: 1499.00)" required className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <input name="validDays" type="number" placeholder="Geçerlilik gün (365)" defaultValue={365} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" /> Öne çıkan</label>
            <Button type="submit" className="md:col-span-3">Paket Oluştur</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allPackages.map((p) => (
          <Card key={p.id} className={p.isFeatured ? "border-violet-300 bg-violet-50/30" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center text-base">{p.nameTr} {p.isFeatured && <Badge className="bg-violet-600 text-white">Öne çıkan</Badge>}</CardTitle>
              <div className="text-sm text-zinc-600">{p.credits} kredi {p.bonusCredits ? `+ ${p.bonusCredits} bonus` : ""} • {p.validDays} gün</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-black text-zinc-900">{p.priceTry} ₺</div>
              <div className="text-xs text-zinc-500">Aktif: {p.isActive ? "Evet" : "Hayır"} • Sıra: {p.sortOrder}</div>
              <div className="flex flex-wrap gap-2">
                <form action={async () => { "use server"; await togglePackageActive(p.id, !p.isActive); }}>
                  <Button type="submit" variant="outline" size="sm">{p.isActive ? "Pasif Yap" : "Aktif Yap"}</Button>
                </form>
                <form action={async () => { "use server"; await setPackageFeatured(p.id, !p.isFeatured); }}>
                  <Button type="submit" variant="outline" size="sm">{p.isFeatured ? "Öne Çıkarma" : "Öne Çıkar"}</Button>
                </form>
                <form action={async () => { "use server"; await deletePackage(p.id); }}>
                  <Button type="submit" variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Sil</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {allPackages.length === 0 && <div className="text-sm text-zinc-500">Henüz paket yok.</div>}
      </div>
    </div>
  );
}
