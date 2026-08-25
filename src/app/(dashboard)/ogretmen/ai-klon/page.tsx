import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";

export default async function AIKlonStudio() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") {
    redirect(session.user.role === "superadmin" ? "/superadmin" : "/ogrenci");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Akademi Klonu Stüdyosu</h1>
        <p className="text-sm text-zinc-600">Sesin, tarzın, püf noktaların — Akademi Klonun bunlarla eğitilir. Her etkileşimden hakediş kazanırsın.</p>
      </div>

      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="pt-6 text-sm">
          <strong>KVKK & Etik:</strong> Ses örneği yüklemeden önce <strong>Açık Rıza Metni</strong>ni onayla. Klonun SuperAdmin onayından sonra yayına alınır. İstediğin an klonunu durdurabilirsin.
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>1. Ses Örneği Yükle</CardTitle><CardDescription>2-10 dk temiz ses (ders anlatımı, farklı tonlarda). 16kHz+ önerilir.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <input type="file" accept="audio/*" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <div className="text-xs text-zinc-500">2-10 dakikalık temiz ses yeterli. Onay sonrası Klonun yayına alınır.</div>
            <label className="flex gap-2 text-xs text-zinc-600"><input type="checkbox" /> Sesimin Akademi Klonum için kullanılmasına açık rıza veriyorum (v1.0)</label>
            <Button className="w-full">Sesi Yükle & Klonla</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Tarz & Püf Noktaları</CardTitle><CardDescription>Öğrencilerin en çok takıldığı yerler, senin çözüm stilin.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <select className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900">
              <option>Sokratik — soru sorarak öğretirim</option>
              <option>Adım adım — formülü ezberletmem</option>
              <option>Arkadaş canlısı — motive ederim</option>
            </select>
            <textarea placeholder="Örn: Kesirlerde payda eşitlemeden toplama yapılmaz — bunu her derste vurgularım..." className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 min-h-24" />
            <textarea placeholder="Sık yapılan hata: Öğrenciler x'i karşıya atarken işaret değiştirmez..." className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 min-h-24" />
            <Button variant="outline" className="w-full">Kaydet</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>3. Bilgi Tabanı</CardTitle><CardDescription>PDF, not, video transkripti yükle — Akademi Klonun bunlardan öğrensin.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <input type="file" multiple accept=".pdf,.txt,.docx" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
          <div className="text-xs text-zinc-500">Yüklediğin dokümanlar Klonunun bilgi tabanına eklenir ve öğrenci sorularında kullanılır.</div>
          <Button variant="outline">Dokümanları İşle</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>4. Fiyatlandır & Yayına Al</CardTitle><CardDescription>Akademi Klonunla özel ders dakikası kaç kredi? Öneri: 2 kredi/dk</CardDescription></CardHeader>
        <CardContent className="flex gap-3 items-end">
          <div className="flex-1"><label className="text-xs text-zinc-500">Kredi / dakika</label><input defaultValue={2} type="number" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-zinc-900" /></div>
          <Button>Onaya Gönder</Button>
          <Badge>Durum: taslak</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Test Et</CardTitle><CardDescription>Akademi Klonunu yayınlamadan önce dene.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <input placeholder="Örn: Hocam kesirlerde toplama nasıl yapılır?" className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-900 placeholder:text-zinc-400" />
          <Button className="w-full">Akademi Klonunla Sohbet Et (metin + ses)</Button>
          <div className="text-xs text-zinc-500">Öğrenci başına kullanım kredine yansır.</div>
        </CardContent>
      </Card>
    </div>
  );
}
