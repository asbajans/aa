import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Bot,
  Coins,
  Wallet,
  ShieldCheck,
  Camera,
  Mic,
  Sparkles,
  Users,
  Cpu,
  Zap,
  Layers,
  GraduationCap,
  ArrowRight,
  Play,
  Waves,
  Brain,
  Database,
  Radio,
  Check,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-violet-500/30">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* grid + orbs */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute top-20 -right-40 h-[560px] w-[560px] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[420px] w-[900px] rounded-full bg-indigo-600/15 blur-[100px]" />

        <div className="relative mx-auto max-w-[1280px] px-4 md:px-6 pt-10 md:pt-16 pb-12">
          {/* top badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LGS • YKS • CANLI STÜDYO AKTİF
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-violet-200">
              <Cpu size={12} /> 24c / 144GB • GPU yok • OpenRouter
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-zinc-300">
              <ShieldCheck size={12} /> KVKK + Açık Rıza
            </span>
          </div>

          <div className="mt-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-10 items-center">
            {/* left copy */}
            <div>
              <h1 className="text-[32px] md:text-[54px] font-black tracking-[-0.04em] leading-[0.95]">
                <span className="text-white">Öğretmeninin</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">AI KLONU</span>
                <span className="text-white"> ile</span>
                <br />
                <span className="text-white">7/24 özel ders.</span>
              </h1>
              <p className="mt-4 max-w-[560px] text-[15px] md:text-[17px] leading-relaxed text-zinc-400">
                Kesintisiz canlı ders <span className="text-white font-medium">max 10 kişi</span> + öğretmenin{" "}
                <span className="text-white">sesini, tarzını, püf noktalarını</span> öğrenmiş yapay zeka klonuyla sınırsız pratik.
                Kamera & ses destekli — mobil öncelikli.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/kayit?role=student">
                  <Button size="lg" className="h-12 rounded-full bg-white text-[#030712] hover:bg-zinc-100 font-bold px-7 shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                    Öğrenci Olarak Başla <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
                <Link href="/kayit?role=teacher">
                  <Button size="lg" variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 backdrop-blur px-7">
                    <GraduationCap size={16} className="mr-1" /> Öğretmen Olarak Kazan
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Iyzico / PayTR / Stripe</span>
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> Şeffaf hakediş</span>
                <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-400" /> 4000–4200 port, Tunnel</span>
              </div>

              {/* stats */}
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-[520px]">
                {[
                  { k: "195", l: "eşzamanlı\nkatılımcı" },
                  { k: "10", l: "max sınıf\nmevcudu" },
                  { k: "7/24", l: "AI klon\naktif" },
                ].map((s) => (
                  <div key={s.k} className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-4">
                    <div className="text-2xl font-black text-white">{s.k}</div>
                    <div className="text-[11px] leading-tight text-zinc-500 whitespace-pre">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* right — high-tech demo */}
            <div className="relative">
              {/* glow behind */}
              <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-violet-600/20 via-indigo-600/20 to-cyan-500/20 blur-2xl" />

              <Card className="relative overflow-hidden rounded-[24px] border-white/10 bg-[#0a0f1f]/80 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
                {/* terminal header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> CANLI
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 text-zinc-400">
                      <Radio size={12} /> livekit.akademi.biz.tr
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                </div>

                {/* AI clone header */}
                <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-5 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.06)_50%)] bg-[length:100%_4px] opacity-30" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-xs backdrop-blur">
                        <Bot size={14} /> AI KLON • v1
                      </div>
                      <div className="mt-3 text-[22px] font-black tracking-tight">Ayşe Hoca’nın Klonu</div>
                      <div className="text-sm text-white/80">Matematik • LGS • Sokratik • 2.3dk ses ile klonlandı</div>
                      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                        <Badge className="bg-white text-[#030712] hover:bg-white border-0">RAG • pgvector 1536</Badge>
                        <Badge className="bg-white/15 text-white border-white/20">TTS: gpt-4o-mini-tts</Badge>
                        <Badge className="bg-white/15 text-white border-white/20">Vision • gpt-4o-mini</Badge>
                      </div>
                    </div>
                    <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-lg">
                      <Waves size={22} />
                    </div>
                  </div>
                  {/* waveform */}
                  <div className="relative mt-4 flex items-end gap-[3px] h-8">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-full bg-white/90"
                        style={{ height: `${12 + ((i * 7) % 20)}px`, opacity: 0.7 + (i % 3) * 0.1 }}
                      />
                    ))}
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-black/20 border border-white/20 px-2 py-1 text-xs">
                      <Mic size={12} /> 5 kredi / 10dk
                    </span>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3 bg-[#0a0f1f]">
                  <div className="flex gap-2">
                    <span className="h-7 w-7 grid place-items-center rounded-full bg-violet-500 text-white shrink-0">
                      <Camera size={14} />
                    </span>
                    <div className="flex-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] p-3">
                      <div className="text-xs text-zinc-500">Öğrenci • foto yükledi</div>
                      <div className="text-sm font-medium text-white">“Hocam bu kesir sorusunu sesli çözer misiniz?”</div>
                      <div className="mt-2 grid place-items-center rounded-xl border border-dashed border-white/10 bg-black/20 p-3 text-xs text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                          <Layers size={12} /> soru.jpg • 1.2MB • Vision ile okundu
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
                        <Brain size={12} /> Klon — Ayşe Hoca sesiyle (sokratik)
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-zinc-200">
                        “Güzel soru! Paydaları eşitlemeden toplama yapamayız — sence neden? Önce{" "}
                        <span className="rounded bg-white text-[#030712] px-1 font-bold">1/2 → 3/6</span> yapmayı dene, ben adım adım eşlik edeceğim.”
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/30 border border-white/10 px-2 py-1 text-zinc-400">
                          <Database size={11} /> 5 chunk • RAG
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 px-2 py-1 text-emerald-300">
                          <Zap size={11} /> ~$0.0002 / soru
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white text-[#030712] px-2 py-1 font-semibold">
                          <Play size={11} /> Ses çal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles size={12} className="text-violet-400" /> Her etkileşim öğretmene hakediş
                    </span>
                    <span className="text-zinc-400">4006–4200 UDP • 50000–50194</span>
                  </div>
                </CardContent>
              </Card>

              {/* floating badges */}
              <div className="pointer-events-none absolute -right-2 -top-2 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0f1f] px-3 py-2 text-xs text-white shadow-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 19 sınıf • canlı
              </div>
              <div className="pointer-events-none absolute -left-3 bottom-6 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#0a0f1f] px-3 py-2 text-xs text-white shadow-xl">
                <Cpu size={14} className="text-cyan-400" /> OpenRouter • gpt-4o-mini
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / TECH STACK */}
      <section className="border-y border-white/10 bg-white/[0.03] backdrop-blur">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
          <span className="font-medium tracking-widest text-zinc-500">TEKNOLOJİ</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-6 w-16 rounded bg-white/10 grid place-items-center font-bold text-white text-[10px]">LIVEKIT</span> SFU • max 10
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-6 w-20 rounded bg-white/10 grid place-items-center font-bold text-white text-[10px]">OPENROUTER</span> gpt-4o-mini
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-6 w-16 rounded bg-white/10 grid place-items-center font-bold text-white text-[10px]">PGVECTOR</span> 1536
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-6 w-14 rounded bg-white/10 grid place-items-center font-bold text-white text-[10px]">R2</span> Cloudflare
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-6 w-14 rounded bg-white/10 grid place-items-center font-bold text-white text-[10px]">EXPO 57</span> Mobil
          </span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-[1280px] px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <Layers size={12} /> PLATFORM • MODÜLLER
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-white">Online eğitim için her şey — tek stack.</h2>
            <p className="mt-2 max-w-[640px] text-sm text-zinc-400">Canlı stüdyo, AI klon, paket/kredi, hakediş — SüperAdmin’den tek panelde. Portainer Stack + Tunnel ile kendi sunucunda.</p>
          </div>
          <Link href="/kesfet" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-white hover:gap-2 transition-all">
            Sınıfları keşfet <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { icon: Video, title: "Canlı Ders — max 10", desc: "LiveKit SFU, düşük gecikme, kayıt, beyaz tahta, yoklama. Tunnel: livekit.akademi.biz.tr → 4003.", grad: "from-violet-600 to-indigo-600" },
            { icon: Bot, title: "AI Öğretmen Klonu", desc: "Ses + tarz + püf noktaları + RAG. Fiyat/performans: gpt-4o-mini, gemini-flash, deepseek.", grad: "from-fuchsia-600 to-violet-600" },
            { icon: Coins, title: "Paket & Kredi", desc: "SüperAdmin paket tanımlar, öğrenci kredi harcar. Iyzico/PayTR/Stripe + manuel.", grad: "from-cyan-600 to-blue-600" },
            { icon: Wallet, title: "Hakediş — şeffaf", desc: "Canlı %80, AI %70 öğretmene. Periyot haftalık/2 hafta/aylık, min 500₺.", grad: "from-emerald-600 to-teal-600" },
            { icon: Users, title: "3 Panel — RBAC", desc: "Öğrenci / Öğretmen / SüperAdmin. Ban, onay, moderasyon, audit log.", grad: "from-orange-600 to-red-600" },
            { icon: ShieldCheck, title: "KVKK & Etik", desc: "Ses klonu açık rıza + versiyon logu. Onay olmadan yayın yok.", grad: "from-zinc-700 to-zinc-600" },
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

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-[1280px] px-4 md:px-6 pb-12">
        <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl md:text-2xl font-black text-white">Nasıl çalışır?</h3>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-400">LGS & YKS odak — tüm seviyeler hazır</span>
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[
              { n: "01", t: "Öğretmen sınıf açar", d: "Başlık, kapasite (max 10), fiyat (kredi), müfredat. Takvimde slot, SuperAdmin onay." },
              { n: "02", t: "Öğrenci kredi ile kaydolur", d: "Paket al → kredi düş → canlı derse katıl / AI klonla pratik. Yoklama & kayıt izleme." },
              { n: "03", t: "AI klon pasif kazandırır", d: "Ses yükle → RAG → stil ayarla → onaya gönder → her etkileşim hakediş." },
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

      {/* LGS/YKS */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-10">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-xl md:text-2xl font-black text-white">İlk odak: LGS & YKS</h2>
            <span className="rounded-full bg-white text-[#030712] px-2.5 py-1 text-xs font-bold">8 branş seed</span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">Tüm öğrenciler hedef, AI klonları önce LGS/YKS branşlarında eğitiliyor. Yeni branş SuperAdmin’den 1 tık.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {["Matematik", "Fen Bilimleri", "Türkçe", "İnkılap", "TYT Matematik", "AYT Matematik", "Fizik", "Kimya"].map((b) => (
              <div key={b} className="group rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 font-medium text-white hover:bg-white/[0.08] transition flex items-center justify-between">
                {b} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition text-zinc-400" />
              </div>
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
                <Zap size={12} className="text-yellow-400" /> Mobil şart — kamera & ses
              </div>
              <div className="mt-3 text-xl md:text-2xl font-black text-white">Fotoğraf çek, sesli sor, klon sesle çözsün.</div>
              <div className="text-sm text-zinc-400">Expo iOS/Android • LiveKit RN • Vision + TTS • Beyaz tahta yakında</div>
            </div>
            <div className="flex gap-3">
              <Link href="/kayit?role=student">
                <Button size="lg" className="rounded-full bg-white text-[#030712] hover:bg-zinc-100 font-bold px-7 h-12">
                  Hemen dene
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
