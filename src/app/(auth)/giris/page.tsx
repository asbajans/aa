import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, X } from "lucide-react";

export default function GirisPage() {
  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute top-20 -right-40 h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-[130px]" />

      <Card className="relative w-full max-w-md bg-white text-zinc-900 border-zinc-200 shadow-[0_20px_80px_rgba(0,0,0,0.5)] rounded-[20px] overflow-hidden">
        <Link href="/" className="absolute right-3 top-3 h-8 w-8 grid place-items-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition">
          <X size={16} />
        </Link>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="h-8 w-8 grid place-items-center rounded-lg bg-zinc-900 text-white"><GraduationCap size={16} /></span>
            akademi<span className="text-zinc-400">.biz.tr</span>
          </div>
          <CardTitle className="mt-4 text-zinc-900">Giriş Yap</CardTitle>
          <CardDescription className="text-zinc-500">akademi.biz.tr — LGS & YKS • Akademi Klonu ile 7/24 pratik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3">
            <input placeholder="E-posta" type="email" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
            <input placeholder="Şifre" type="password" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
            <Button className="w-full h-11 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-semibold" type="submit">Giriş Yap</Button>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/kayit" className="rounded-xl bg-violet-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-violet-700">Kayıt Ol</Link>
              <Link href="/" className="rounded-xl border border-zinc-200 bg-white py-2.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50">Ana Sayfa</Link>
            </div>
          </form>
          <div className="text-center text-sm text-zinc-500">
            Hesabın yok mu? <Link href="/kayit" className="font-semibold text-violet-600 hover:text-violet-700">Kayıt Ol</Link>
            <span className="mx-2 text-zinc-300">•</span>
            <Link href="/kesfet" className="font-medium text-zinc-700 hover:text-zinc-900">Sınıfları keşfet</Link>
          </div>
          <div className="text-xs text-zinc-400 text-center">Şifreni mi unuttun? Yakında e-posta ile sıfırlama gelecek.</div>
        </CardContent>
      </Card>
    </div>
  );
}
