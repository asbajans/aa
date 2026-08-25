import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const pkgs = [
  { name: "Başlangıç", credits: 100, price: "499₺", bonus: "", featured: false, desc: "Denemek için ideal" },
  { name: "Popüler", credits: 300, price: "1.299₺", bonus: "+50 bonus", featured: true, desc: "En çok tercih edilen" },
  { name: "Yoğun", credits: 600, price: "2.299₺", bonus: "+150 bonus", featured: false, desc: "Düzenli pratik için" },
  { name: "Aylık", credits: 2000, price: "3.999₺", bonus: "+500 bonus", featured: false, desc: "Sınırsız hissi" },
];

export default function PaketlerPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-1">
            ← Ana sayfaya dön
          </Link>
          <div className="flex gap-2">
            <Link href="/giris"><Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">Giriş Yap</Button></Link>
            <Link href="/kayit"><Button size="sm" className="bg-white text-[#030712] hover:bg-zinc-100">Kayıt Ol</Button></Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            <Sparkles size={12} /> Esnek paketler • Güvenli ödeme
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-black tracking-tight">İhtiyacın kadar al, kullandığın kadar öde</h1>
          <p className="mt-2 text-zinc-400 max-w-2xl mx-auto">Kredilerinle canlı derslere katıl, Akademi Klonunla pratik yap. Paketler 365 gün geçerli — aile bütçesini yorar mı diye düşünme.</p>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {pkgs.map((p) => (
            <Card key={p.name} className={`rounded-[20px] overflow-hidden ${p.featured ? "border-violet-300 bg-white shadow-[0_10px_40px_rgba(139,92,246,0.25)] scale-[1.02]" : "border-zinc-200 bg-white"}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center text-zinc-900 text-base">
                  {p.name} {p.featured && <Badge className="bg-violet-600 text-white hover:bg-violet-600 border-0">Popüler</Badge>}
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  <span className="font-bold text-zinc-900">{p.credits} kredi</span> {p.bonus && <span className="text-violet-600">• {p.bonus}</span>} <span className="text-xs">• {p.desc}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900">{p.price}</div>
                <div className="text-xs text-zinc-500 mt-1">365 gün geçerli • İstediğin derse harca</div>
                <ul className="mt-3 space-y-1.5 text-xs text-zinc-600">
                  <li className="flex gap-1.5 items-center"><Check size={14} className="text-emerald-500" /> Canlı ders + Akademi Klonu</li>
                  <li className="flex gap-1.5 items-center"><Check size={14} className="text-emerald-500" /> Kayıtları tekrar izle</li>
                  <li className="flex gap-1.5 items-center"><Check size={14} className="text-emerald-500" /> Güvenli ödeme</li>
                </ul>
                <Link href={p.featured ? "/kayit?role=student" : "/kayit"}>
                  <Button className={`w-full mt-4 rounded-xl h-10 font-semibold ${p.featured ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                    Satın Al <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
                <div className="text-xs text-zinc-400 mt-2 text-center">Ödeme: Güvenli altyapı • Fatura kesilir</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1"><ShieldCheck size={12} /> KVKK uyumlu</span>
          <span>•</span>
          <Link href="/kvkk" className="underline hover:text-zinc-300">Aydınlatma metni</Link>
          <span>•</span>
          <Link href="/kesfet" className="underline hover:text-zinc-300">Sınıfları keşfet</Link>
          <span>•</span>
          <Link href="/giris" className="underline hover:text-zinc-300">Giriş yap</Link>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-zinc-400 text-center">
          Emin değil misin? Önce <Link href="/kayit" className="text-white font-medium underline">ücretsiz kayıt ol</Link>, sınıfları incele, sonra karar ver. İptal/iade için destek yanındayız.
        </div>
      </div>
    </div>
  );
}
