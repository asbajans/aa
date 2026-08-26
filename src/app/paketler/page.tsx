/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function PaketlerPage() {
  let pkgs: typeof packages.$inferSelect[] = [];
  try {
    pkgs = await db.select().from(packages).where(eq(packages.isActive, true)).orderBy(packages.sortOrder, packages.credits);
  } catch {
    // fallback: DB yoksa seed'deki gibi göster
    pkgs = [
      { id: "1", nameTr: "Başlangıç", nameEn: null, nameEs: null, credits: 100, bonusCredits: 0, priceTry: "499.00", priceUsd: null, validDays: 365, isActive: true, isFeatured: false, sortOrder: 0, iyzicoProductId: null, paytrProductId: null, stripePriceId: null, createdAt: new Date(), updatedAt: new Date() } as any,
      { id: "2", nameTr: "Popüler", nameEn: null, nameEs: null, credits: 300, bonusCredits: 50, priceTry: "1299.00", priceUsd: null, validDays: 365, isActive: true, isFeatured: true, sortOrder: 1, iyzicoProductId: null, paytrProductId: null, stripePriceId: null, createdAt: new Date(), updatedAt: new Date() } as any,
      { id: "3", nameTr: "Yoğun", nameEn: null, nameEs: null, credits: 600, bonusCredits: 150, priceTry: "2299.00", priceUsd: null, validDays: 365, isActive: true, isFeatured: false, sortOrder: 2, iyzicoProductId: null, paytrProductId: null, stripePriceId: null, createdAt: new Date(), updatedAt: new Date() } as any,
      { id: "4", nameTr: "Aylık", nameEn: null, nameEs: null, credits: 2000, bonusCredits: 500, priceTry: "3999.00", priceUsd: null, validDays: 365, isActive: true, isFeatured: false, sortOrder: 3, iyzicoProductId: null, paytrProductId: null, stripePriceId: null, createdAt: new Date(), updatedAt: new Date() } as any,
    ];
  }

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
          <p className="mt-2 text-zinc-400 max-w-2xl mx-auto">Kredilerinle canlı derslere katıl, Akademi Klonunla pratik yap. Paketler {pkgs[0]?.validDays || 365} gün geçerli.</p>
        </div>

        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {pkgs.map((p) => (
            <Card key={p.id} className={`rounded-[20px] overflow-hidden ${p.isFeatured ? "border-violet-300 bg-white shadow-[0_10px_40px_rgba(139,92,246,0.25)] scale-[1.02]" : "border-zinc-200 bg-white"}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center text-zinc-900 text-base">
                  {p.nameTr} {p.isFeatured && <Badge className="bg-violet-600 text-white hover:bg-violet-600 border-0">Popüler</Badge>}
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  <span className="font-bold text-zinc-900">{p.credits} kredi</span> {p.bonusCredits ? <span className="text-violet-600">• +{p.bonusCredits} bonus</span> : null}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-zinc-900">{p.priceTry} ₺</div>
                <div className="text-xs text-zinc-500 mt-1">{p.validDays} gün geçerli • İstediğin derse harca</div>
                <ul className="mt-3 space-y-1.5 text-xs text-zinc-600">
                  <li className="flex gap-1.5 items-center"><Check size={14} className="text-emerald-500" /> Canlı ders + Akademi Klonu</li>
                  <li className="flex gap-1.5 items-center"><Check size={14} className="text-emerald-500" /> Kayıtları tekrar izle</li>
                  <li className="flex gap-1.5 items-center"><Check size={14} className="text-emerald-500" /> Güvenli ödeme</li>
                </ul>
                <Link href="/kayit?role=student">
                  <Button className={`w-full mt-4 rounded-xl h-10 font-semibold ${p.isFeatured ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                    Satın Al <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
                <div className="text-xs text-zinc-400 mt-2 text-center">SüperAdmin tarafından yönetilir</div>
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
        </div>
      </div>
    </div>
  );
}
