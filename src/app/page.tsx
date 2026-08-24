import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Video, Bot, Coins, Wallet, ShieldCheck, Camera, Mic, Sparkles, Users, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="mb-4">LGS • YKS • İlk fazda Türkçe, altyapı EN/ES hazır</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Öğretmeninin <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">AI Klonuyla</span> 7/24 özel ders
              </h1>
              <p className="mt-4 text-lg text-zinc-600">
                Kesintisiz canlı ders (max 10 kişi) + öğretmeninin <b>sesini, tarzını, püf noktalarını</b> öğrenmiş yapay zeka klonuyla sınırsız pratik. Kamera & ses destekli, mobil öncelikli.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/kayit?role=student"><Button size="lg">Öğrenci Olarak Başla</Button></Link>
                <Link href="/kayit?role=teacher"><Button size="lg" variant="outline">Öğretmen Olarak Kazan</Button></Link>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1"><ShieldCheck size={16} /> KVKK + Açık Rıza</span>
                <span className="flex items-center gap-1"><Wallet size={16} /> Şeffaf Hakediş</span>
                <span className="flex items-center gap-1"><Coins size={16} /> Kredi/Paket</span>
              </div>
            </div>
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center gap-2 text-sm opacity-90"><Bot size={18} /> AI Klon Önizleme</div>
                <div className="mt-3 text-xl font-semibold">“Ayşe Hoca’nın klonu”</div>
                <div className="text-sm opacity-80">Matematik • LGS • Sokratik tarz • 2.3 dk ses örneği ile klonlandı</div>
              </div>
              <CardContent className="pt-6 space-y-3 text-sm">
                <div className="rounded-xl bg-zinc-50 p-3">
                  <div className="text-xs text-zinc-500">Öğrenci fotoğraf yükledi →</div>
                  <div className="font-medium">“Hocam bu kesir sorusunu sesli çözer misiniz?”</div>
                </div>
                <div className="rounded-xl bg-violet-50 p-3 border border-violet-200">
                  <div className="font-medium flex items-center gap-1"><Mic size={14} /> Klon (Ayşe Hoca sesiyle):</div>
                  <div className="text-zinc-700">“Güzel soru! Paydaları eşitlemeden toplama yapamayız, sence neden? Önce 1/2’yi 3/6 yapmayı dene, ben adım adım eşlik edeceğim.”</div>
                  <div className="mt-2 flex gap-2 text-xs text-zinc-500"><Camera size={12} /> Beyaz tahtada çözüm • <Clock size={12} /> 5 kredi / 10 dk</div>
                </div>
                <div className="text-xs text-zinc-500 flex items-center gap-1"><Sparkles size={12} /> Her etkileşim öğretmene hakediş olarak yazılır.</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-6xl px-4 pb-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: Video, title: "Canlı Ders (max 10)", desc: "LiveKit SFU, düşük gecikme, kayıt, beyaz tahta, yoklama. Cloudflare Tunnel arkasında güvenli." },
            { icon: Bot, title: "AI Öğretmen Klonu", desc: "Ses + tarz + püf noktaları + RAG bilgi tabanı. OpenRouter ile fiyat/performans model seçimi." },
            { icon: Coins, title: "Paket & Kredi", desc: "SuperAdmin'den yönetilen paketler. Iyzico/PayTR/Stripe + manuel ekleme. Esnek harcama." },
            { icon: Wallet, title: "Hakediş Sistemi", desc: "Canlı %80, AI %70 öğretmene. Haftalık/aylık periyot, min tutar ayarlanabilir." },
            { icon: Users, title: "3 Panel", desc: "Öğrenci / Öğretmen / SüperAdmin — rol bazlı, yetkilendirme katı." },
            { icon: ShieldCheck, title: "KVKK & Moderasyon", desc: "Ses klon izni zorunlu, SuperAdmin onayı olmadan klon yayına alınmaz." },
          ].map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white grid place-items-center"><f.icon size={18} /></div>
                <CardTitle className="mt-3">{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        {/* LGS/YKS */}
        <section className="bg-white border-y">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-bold">İlk odak: LGS & YKS</h2>
            <p className="text-zinc-600">Tüm öğrenciler hedef, ama müfredat ve AI klonları önce LGS/YKS branşlarında eğitiliyor. Branş eklemek SuperAdmin’den 1 tık.</p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {["Matematik", "Fen Bilimleri", "Türkçe", "İnkılap", "TYT Matematik", "AYT Matematik", "Fizik", "Kimya"].map((b) => (
                <div key={b} className="rounded-xl border bg-zinc-50 px-4 py-3 font-medium">{b}</div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <Card className="bg-zinc-900 text-white border-zinc-800">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-xl font-semibold">Mobil uygulama ile kamera & sesli pratik şart</div>
                <div className="text-zinc-400">Expo ile iOS/Android — fotoğraf çek, sesli sor, klon sesle cevaplasın. Responsive web yetmez.</div>
              </div>
              <Link href="/kayit"><Button variant="secondary" size="lg">Hemen Dene</Button></Link>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
