import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1.5 shadow-[0_0_20px_rgba(139,92,246,0.4)] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="akademi.biz.tr" className="h-full w-full object-contain" />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-white">akademi<span className="font-normal text-white/60">.biz.tr</span></span>
          <span className="hidden md:inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
            <Sparkles size={11} /> AKADEMİ KLONU
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium">
          <Link href="/kesfet" className="px-3 py-2 text-zinc-400 hover:text-white transition">Sınıflar</Link>
          <Link href="/paketler" className="px-3 py-2 text-zinc-400 hover:text-white transition">Paketler</Link>
          <Link href="/kvkk" className="px-3 py-2 text-zinc-400 hover:text-white transition">KVKK</Link>
          <span className="ml-2 hidden xl:inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Canlı dersler aktif
          </span>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/giris" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 border border-transparent">Giriş Yap</Button>
          </Link>
          <Link href="/kayit">
            <Button size="sm" className="bg-white text-[#030712] hover:bg-zinc-100 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]">Kayıt Ol</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
