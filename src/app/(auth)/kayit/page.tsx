import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X, Sparkles, ShieldCheck } from "lucide-react";

export default async function KayitPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role: roleRaw } = await searchParams;
  const role = roleRaw === "teacher" ? "teacher" : "student";

  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute top-20 -right-40 h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-[130px]" />

      <Card className="relative w-full max-w-lg bg-white text-zinc-900 border-zinc-200 shadow-[0_20px_80px_rgba(0,0,0,0.5)] rounded-[20px] overflow-hidden">
        <Link href="/" className="absolute right-3 top-3 h-8 w-8 grid place-items-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition">
          <X size={16} />
        </Link>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="h-8 w-8 grid place-items-center rounded-lg bg-white border border-zinc-200 p-1 overflow-hidden"><img src="/logo.png" alt="logo" className="h-full w-full object-contain" /></span>
            akademi<span className="text-zinc-400">.biz.tr</span>
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-xs font-medium text-violet-700">
              <Sparkles size={11} /> AKADEMİ KLONU
            </span>
          </div>
          <CardTitle className="mt-4 text-zinc-900">Kayıt Ol — {role === "teacher" ? "Öğretmen" : "Öğrenci (LGS/YKS)"}</CardTitle>
          <CardDescription className="text-zinc-500">Hesabını oluştur, seviyeni seç ve hemen başla. KVKK onayı zorunludur.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/kayit?role=student"
              className={`rounded-xl border p-3 text-sm text-center font-medium transition ${role === "student" ? "bg-zinc-900 text-white border-zinc-900 shadow" : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"}`}
            >
              Öğrenciyim
            </Link>
            <Link
              href="/kayit?role=teacher"
              className={`rounded-xl border p-3 text-sm text-center font-medium transition ${role === "teacher" ? "bg-zinc-900 text-white border-zinc-900 shadow" : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"}`}
            >
              Öğretmenim
            </Link>
          </div>

          <form className="space-y-3">
            <input placeholder="Ad Soyad" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
            <input placeholder="E-posta" type="email" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
            <input placeholder="Şifre" type="password" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
            {role === "student" && (
              <select className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                <option>LGS</option>
                <option>YKS</option>
                <option>Diğer</option>
              </select>
            )}
            {role === "teacher" && (
              <>
                <input placeholder="Branş (örn: Matematik)" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
                <input placeholder="IBAN (hakediş için - sonra da ekleyebilirsin)" className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
              </>
            )}
            <label className="flex gap-2 text-xs text-zinc-600 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-xl p-3">
              <input type="checkbox" required className="mt-0.5" />
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-violet-600" />
                <Link href="/kvkk" className="underline font-medium text-zinc-900">KVKK Aydınlatma Metnini</Link> okudum, onaylıyorum.
              </span>
            </label>
            {role === "teacher" && (
              <label className="flex gap-2 text-xs text-zinc-600 leading-relaxed bg-violet-50 border border-violet-200 rounded-xl p-3">
                <input type="checkbox" className="mt-0.5" />
                Sesimin Akademi Klonum için kullanılmasına açık rıza veriyorum (isteğe bağlı, sonra da verilebilir).
              </label>
            )}
            <Button className="w-full h-11 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-semibold" type="submit">Hesap Oluştur</Button>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/giris" className="rounded-xl border border-zinc-200 bg-white py-2.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50">Giriş Yap</Link>
              <Link href="/" className="rounded-xl bg-zinc-100 py-2.5 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-200">Ana Sayfa</Link>
            </div>
          </form>

          <div className="text-center text-sm text-zinc-500">
            Zaten hesabın var mı? <Link href="/giris" className="font-semibold text-violet-600 hover:text-violet-700">Giriş Yap</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
