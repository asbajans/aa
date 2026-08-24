import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AIKlonStudio() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Klon Stüdyosu</h1>
        <p className="text-sm text-zinc-600">Sesin, tarzın, püf noktaların — klonun bunlarla eğitilir. Her etkileşimden hakediş kazanırsın.</p>
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
            <input type="file" accept="audio/*" className="w-full rounded-xl border p-3 text-sm" />
            <div className="text-xs text-zinc-500">Sağlayıcı: OpenRouter TTS (gpt-4o-mini-tts) — fiyat ~$0.015/1k karakter. 10dk ~ $0.02. ElevenLabs fallback hazır.</div>
            <label className="flex gap-2 text-xs"><input type="checkbox" /> Sesimin klonlanmasına açık rıza veriyorum (v1.0)</label>
            <Button className="w-full">Sesi Yükle & Klonla</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>2. Tarz & Püf Noktaları</CardTitle><CardDescription>Öğrencilerin en çok takıldığı yerler, senin çözüm stilin.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <select className="w-full rounded-xl border px-3 py-2 text-sm">
              <option>Sokratik — soru sorarak öğretirim</option>
              <option>Adım adım — formülü ezberletmem</option>
              <option>Arkadaş canlısı — motive ederim</option>
            </select>
            <textarea placeholder="Örn: Kesirlerde payda eşitlemeden toplama yapılmaz — bunu her derste vurgularım..." className="w-full rounded-xl border p-3 text-sm min-h-24" />
            <textarea placeholder="Sık yapılan hata: Öğrenciler x'i karşıya atarken işaret değiştirmez..." className="w-full rounded-xl border p-3 text-sm min-h-24" />
            <Button variant="outline" className="w-full">Kaydet</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>3. Bilgi Tabanı (RAG)</CardTitle><CardDescription>PDF, not, video transkripti yükle — embedding ile vektör DB’ye gider (pgvector 1536).</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <input type="file" multiple accept=".pdf,.txt,.docx" className="w-full rounded-xl border p-3 text-sm" />
          <div className="text-xs text-zinc-500">Yüklenen dokümanlar chunk’lanıp OpenAI text-embedding-3-small ile embed edilir. Öğrenci sorusunda en yakın 5 chunk RAG’a gider.</div>
          <Button variant="outline">Dokümanları İşle</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>4. Fiyatlandır & Yayına Al</CardTitle><CardDescription>AI klonunla özel ders dakikası kaç kredi? Öneri: 2 kredi/dk (~1 TL/dk)</CardDescription></CardHeader>
        <CardContent className="flex gap-3 items-end">
          <div className="flex-1"><label className="text-xs text-zinc-500">Kredi / dakika</label><input defaultValue={2} type="number" className="w-full rounded-xl border px-3 py-2" /></div>
          <Button>Onaya Gönder</Button>
          <Badge>Durum: taslak</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Test Et</CardTitle><CardDescription>Klonunu yayınlamadan önce dene — aynı LLM pipeline (gpt-4o-mini → fallback gemini-flash).</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <input placeholder="Örn: Hocam kesirlerde toplama nasıl yapılır?" className="w-full rounded-xl border px-3 py-3 text-sm" />
          <Button className="w-full">Klonla Sohbet Et (metin + ses)</Button>
          <div className="text-xs text-zinc-500">Maliyet: ~0.0002$ / soru (gpt-4o-mini) + TTS $0.02/dk — krediye yansıtılır.</div>
        </CardContent>
      </Card>
    </div>
  );
}
