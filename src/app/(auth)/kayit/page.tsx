"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X, Sparkles, ShieldCheck } from "lucide-react";
import { signUpEmail } from "@/lib/auth-client";

function KayitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleRaw = searchParams.get("role");
  const role = roleRaw === "teacher" ? "teacher" : "student";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("lgs");
  const [branch, setBranch] = useState("");
  const [kvkk, setKvkk] = useState(false);
  const [voiceConsent, setVoiceConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!kvkk) {
      setError("KVKK onayı zorunludur.");
      return;
    }
    setLoading(true);
    try {
      await signUpEmail({ name: name.trim(), email: email.trim(), password, role });
      // Otomatik giriş (sign-up sonrası session oluşur), panele yönlendir
      router.push(role === "teacher" ? "/ogretmen" : "/ogrenci");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Kayıt başarısız. Farklı bir e-posta dene.");
    } finally {
      setLoading(false);
    }
  }

  return (
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

        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Ad Soyad" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
          <input placeholder="E-posta" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
          <input placeholder="Şifre (en az 8 karakter)" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
          {role === "student" && (
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20">
              <option value="lgs">LGS</option>
              <option value="yks">YKS</option>
              <option value="other">Diğer</option>
            </select>
          )}
          {role === "teacher" && (
            <input placeholder="Branş (örn: Matematik) - sonra da ekleyebilirsin" value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
          )}
          <label className="flex gap-2 text-xs text-zinc-600 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-xl p-3">
            <input type="checkbox" checked={kvkk} onChange={(e) => setKvkk(e.target.checked)} className="mt-0.5" />
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-violet-600" />
              <Link href="/kvkk" className="underline font-medium text-zinc-900">KVKK Aydınlatma Metnini</Link> okudum, onaylıyorum.
            </span>
          </label>
          {role === "teacher" && (
            <label className="flex gap-2 text-xs text-zinc-600 leading-relaxed bg-violet-50 border border-violet-200 rounded-xl p-3">
              <input type="checkbox" checked={voiceConsent} onChange={(e) => setVoiceConsent(e.target.checked)} className="mt-0.5" />
              Sesimin Akademi Klonum için kullanılmasına açık rıza veriyorum (isteğe bağlı, sonra da verilebilir).
            </label>
          )}
          {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <Button className="w-full h-11 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-semibold" type="submit" disabled={loading}>
            {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
          </Button>
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
  );
}

export default function KayitPage() {
  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="absolute top-20 -right-40 h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-[130px]" />
      {/* Suspense: useSearchParams client hook için gerekli */}
      <Suspense fallback={<div className="text-white text-sm">Yükleniyor...</div>}>
        <KayitForm />
      </Suspense>
    </div>
  );
}
