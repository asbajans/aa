import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  Bot,
  Coins,
  ShieldCheck,
  Camera,
  Mic,
  Sparkles,
  Users,
  Zap,
  Layers,
  GraduationCap,
  ArrowRight,
  Play,
  Waves,
  Brain,
  Check,
  Star,
  Clock,
  MessageCircle,
  Award,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-violet-500/30">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute top-20 -right-40 h-[560px] w-[560px] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[420px] w-[900px] rounded-full bg-indigo-600/15 blur-[100px]" />

        <div className="relative mx-auto max-w-[1280px] px-4 md:px-6 pt-10 md:pt-16 pb-12">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LGS • YKS • CANLI DERSLER AKTİF
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
              <ShieldCheck size={12} /> Güvenli ve KVKK uyumlu
            </span>
          </div>

          <div className="mt-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 items-center">
            <div>
              <h1 className="text-[32px] md:text-[52px] font-black tracking-[-0.04em] leading-[0.95]">
                <span className="text-white">Öğretmeninin</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Akademi Klonu</span>
                <span className="text-white"> ile</span>
                <br />
                <span className="text-white">7/24 özel ders.</span>
              </h1>
              <p className="mt-4 max-w-[560px] text-[15px] md:text-[17px] leading-relaxed text-zinc-400">
                Canlı derslerde öğretmeninle birebir öğren, ders bitince de onun{" "}
                <span className="text-white font-medium">Akademi Klonu</span> ile gece 2’de bile soru sor.
                Sesini, anlatım tarzını ve püf noktalarını bilen klonun anında yanında.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/kayit?role=student">
                  <Button size="lg" className="h-12 rounded-full bg-white text-[#030712] hover:bg-zinc-100 font-bold px-7 shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                    Ücretsiz Başla <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
                <Link href="/kayit?role=teacher">
                  <Button size="lg" variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 backdrop-blur px-7">
                    <GraduationCap size={16} className="mr-1" /> Öğretmen Olarak Katıl
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5"><Star size={14} className="text-yellow-400" /> Veliler tarafından sevildi</span>
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> İlk ders memnuniyet garantisi</span>
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Güvenli ödeme</span>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
                {[
                  { k: "4.8/5", l: "öğrenci\nmemnuniyeti", sub: "1.200+ yorum" },
                  { k: "8-10", l: "kişilik\nsamimi sınıflar", sub: "soru sormak kolay" },
                  { k: "7/24", l: "Akademi Klonu\ndesteği", sub: "anında cevap" },
                ].map((s) => (
                  <div key={s.k} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-4">
                    <div className="text-xl font-black text-white">{s.k}</div>
                    <div className="text-[11px] leading-tight text-zinc-300 whitespace-pre font-medium">{s.l}</div>
                    <div className="text-[11px] text-zinc-500">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-violet-600/20 via-indigo-600/20 to-cyan-500/20 blur-2xl" />
              <Card className="relative overflow-hidden rounded-[24px] border-white/10 bg-[#0a0f1f]/80 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> CANLI ÖRNEK
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400">
                      <MessageCircle size={12} /> soru → cevap
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-5 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.06)_50%)] bg-[length:100%_4px] opacity-30" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-xs backdrop-blur">
                        <Bot size={14} /> AKADEMİ KLONU
                      </div>
                      <div className="mt-3 text-[22px] font-black tracking-tight">Ayşe Hoca’nın Klonu</div>
                      <div className="text-sm text-white/85">Matematik • LGS • Soru çözerken sana özel anlatır</div>
                    </div>
                    <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-lg">
                      <Waves size={22} />
                    </div>
                  </div>
                  <div className="relative mt-4 flex items-end gap-[3px] h-8">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span key={i} className="flex-1 rounded-full bg-white/90" style={{ height: `${12 + ((i * 7) % 20)}px`, opacity: 0.7 + (i % 3) * 0.1 }} />
                    ))}
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-black/20 border border-white/20 px-2 py-1 text-xs">
                      <Mic size={12} /> Sesli anlatım
                    </span>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3 bg-[#0a0f1f]">
                  <div className="flex gap-2">
                    <span className="h-7 w-7 grid place-items-center rounded-full bg-violet-500 text-white shrink-0">
                      <Camera size={14} />
                    </span>
                    <div className="flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] p-3">
                      <div className="text-xs text-zinc-500">Öğrenci • fotoğraf ile sordu</div>
                      <div className="text-sm font-medium text-white">“Hocam bu kesir sorusunu anlatır mısınız?”</div>
                      <div className="mt-2 grid place-items-center rounded-xl border border-dashed border-white/10 bg-black/20 p-3 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                          <Layers size={12} /> Fotoğrafla soru sor
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="h-7 w-7 grid place-items-center rounded-full bg-white text-violet-600 shrink-0">
                      <Bot size={14} />
                    </span>
                    <div className="flex-1 rounded-2xl rounded-tl-sm border border-violet-500/20 bg-violet-500/10 p-3">
                      <div className="text-xs font-semibold text-violet-300 flex items-center gap-1">
                        <Brain size={12} /> Akademi Klonu — Ayşe Hoca tarzıyla
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-zinc-200">
                        “Harika soru! Paydaları eşitlemeden toplayamayız — sence neden? Önce{" "}
                        <span className="rounded bg-white text-[#030712] px-1 font-bold">1/2 → 3/6</span> yapmayı dene, birlikte çözelim.”
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white text-[#030712] px-2 py-1 font-semibold">
                          <Play size={11} /> Sesli dinle
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2 py-1 text-zinc-300">
                          <Clock size={11} /> 2 dakikada
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles size={12} className="text-violet-400" /> Her pratik seni ileri taşır
                    </span>
                    <span className="text-zinc-400 inline-flex items-center gap-1">
                      <Star size={11} className="text-yellow-400" /> Öğretmen onaylı içerik
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="pointer-events-none absolute -right-2 -top-2 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0f1f] px-3 py-2 text-xs text-white shadow-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Anında cevap
              </div>
              <div className="pointer-events-none absolute -left-3 bottom-6 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0f1f] px-3 py-2 text-xs text-white shadow-xl">
                <Award size={14} className="text-cyan-400" /> MEB müfredatına uyumlu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - user focused */}
      <section className="mx-auto max-w-[1280px] px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <Layers size={12} /> NEDEN AKADEMİ.BIZ.TR?
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-white">Dershaneyi cebine sığdırdık.</h2>
            <p className="mt-2 max-w-[640px] text-sm text-zinc-400">Canlı ders, birebir takip ve gece gündüz yanında olan Akademi Klonun — hepsi tek yerde, sade ve anlaşılır.</p>
          </div>
          <Link href="/kesfet" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-white hover:gap-2 transition-all">
            Sınıfları keşfet <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: Video, title: "Küçük ve samimi sınıflar", desc: "Kalabalıkta kaybolma. Öğretmenin seni tanır, sorularını duyar, takibini yapar.", grad: "from-violet-600 to-indigo-600" },
            { icon: Bot, title: "Akademi Klonu — 7/24 yanında", desc: "Öğretmeninin anlatım tarzıyla, sesiyle ve püf noktalarıyla. Takıldığın yerde anında açıklar.", grad: "from-fuchsia-600 to-violet-600" },
            { icon: Camera, title: "Fotoğraf çek, sor", desc: "Testten fotoğraf çek, klonun sesli ve yazılı adım adım çözsün. Beyaz tahtada gör.", grad: "from-cyan-600 to-blue-600" },
            { icon: Coins, title: "Esnek paketler", desc: "İhtiyacın kadar al, kullandığın kadar öde. Aile bütçesini yormayan seçenekler.", grad: "from-emerald-600 to-teal-600" },
            { icon: Users, title: "Öğretmenine kazandır", desc: "Öğretmenin hem canlı dersten hem de Akademi Klonundan kazanır — daha motive, daha ilgili.", grad: "from-orange-600 to-red-600" },
            { icon: ShieldCheck, title: "Güvenli ve kontrollü", desc: "Onaylı öğretmenler, veli bilgilendirmesi ve KVKK uyumlu yapı.", grad: "from-zinc-700 to-zinc-600" },
          ].map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.04] backdrop-blur p-6 hover:bg-white/[0.06] transition">
              <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-br ${f.grad} opacity-20 blur-2xl group-hover:opacity-30 transition`} />
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.grad} text-white shadow-lg`}>
                <f.icon size={18} />
              </div>
              <div className="mt-4 text-[15px] font-bold text-white">{f.title}</div>
              <div className="mt-1 text-sm leading-relaxed text-zinc-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS - user language */}
      <section className="mx-auto max-w-[1280px] px-4 md:px-6 pb-12">
        <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl md:text-2xl font-black text-white">3 adımda başla</h3>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-400">2 dakikada hazır</span>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { n: "01", t: "Seviyeni seç", d: "LGS, YKS veya diğer branşlar — sana uygun sınıfı bul, öğretmeni incele." },
              { n: "02", t: "Canlı derse katıl", d: "Küçük sınıfta derse gir, sorularını sor, kayıtları sonra tekrar izle." },
              { n: "03", t: "Akademi Klonunla pratik yap", d: "Ders bitince klonunla tekrar et, fotoğraf sor, sesli dinle — 7/24." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-[#030712]/60 p-5">
                <div className="text-xs font-bold tracking-widest text-violet-400">{s.n}</div>
                <div className="mt-1 font-bold text-white">{s.t}</div>
                <div className="mt-1 text-sm text-zinc-400">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANCHES */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-10">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-xl md:text-2xl font-black text-white">LGS ve YKS’de yanındayız</h2>
            <span className="rounded-full bg-white text-[#030712] px-2.5 py-1 text-xs font-bold">Popüler branşlar</span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">Matematikten fen’e, Türkçeden tarihe — en çok ihtiyaç duyulan dersler öncelikli.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {["Matematik", "Fen Bilimleri", "Türkçe", "İnkılap", "TYT Matematik", "AYT Matematik", "Fizik", "Kimya"].map((b) => (
              <Link key={b} href="/kesfet" className="group rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 font-medium text-white hover:bg-white/[0.08] transition flex items-center justify-between">
                {b} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1280px] px-4 md:px-6 py-10">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1px]">
          <div className="rounded-[23px] bg-[#030712] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white">
                <Zap size={12} className="text-yellow-400" /> Birlikte başaralım
              </div>
              <div className="mt-3 text-xl md:text-2xl font-black text-white">Hazırsan ilk dersine bekliyoruz.</div>
              <div className="text-sm text-zinc-400">Ücretsiz hesap oluştur, seviyeni seç, bugün pratik yapmaya başla.</div>
            </div>
            <div className="flex gap-3">
              <Link href="/kayit?role=student">
                <Button size="lg" className="rounded-full bg-white text-[#030712] hover:bg-zinc-100 font-bold px-7 h-12">
                  Hemen başla
                </Button>
              </Link>
              <Link href="/kesfet" className="hidden sm:inline-flex">
                <Button size="lg" variant="outline" className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 h-12">
                  Sınıflara göz at
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
