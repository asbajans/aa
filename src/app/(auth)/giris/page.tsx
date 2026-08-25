"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";
import { signInEmail } from "@/lib/auth-client";

const ROLE_HOME: Record<string, string> = {
  superadmin: "/superadmin",
  teacher: "/ogretmen",
  student: "/ogrenci",
};

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInEmail(email.trim(), password);
      // Rolü session'dan çekmek için sayfayı yenile ve role göre yönlendir
      const res = await fetch("/api/auth/get-session", { credentials: "include" });
      const session = await res.json().catch(() => null);
      const role = session?.user?.role || "student";
      router.push(ROLE_HOME[role] || "/ogrenci");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Giriş başarısız. E-posta/şifreyi kontrol et.");
    } finally {
      setLoading(false);
    }
  }

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
            <span className="h-8 w-8 grid place-items-center rounded-lg bg-white border border-zinc-200 p-1 overflow-hidden"><img src="/logo.png" alt="logo" className="h-full w-full object-contain" /></span>
            akademi<span className="text-zinc-400">.biz.tr</span>
          </div>
          <CardTitle className="mt-4 text-zinc-900">Giriş Yap</CardTitle>
          <CardDescription className="text-zinc-500">akademi.biz.tr — LGS & YKS • Akademi Klonu ile 7/24 pratik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="E-posta" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
            <input placeholder="Şifre" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
            {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
            <Button className="w-full h-11 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-semibold" type="submit" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
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
          <details className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
            <summary className="text-xs font-semibold text-zinc-700 cursor-pointer">Deneme hesapları</summary>
            <div className="mt-2 space-y-1 text-xs text-zinc-600">
              <div><b>Admin:</b> admin@akademi.biz.tr / Admin123!</div>
              <div><b>Öğretmen:</b> ogretmen@akademi.biz.tr / Ogretmen123!</div>
              <div><b>Öğrenci:</b> ogrenci@akademi.biz.tr / Ogrenci123!</div>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  );
}
