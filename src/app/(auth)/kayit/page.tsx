import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function KayitPage({ searchParams }: { searchParams: { role?: string } }) {
  const role = searchParams.role === "teacher" ? "teacher" : "student";
  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Kayıt Ol — {role === "teacher" ? "Öğretmen" : "Öğrenci (LGS/YKS)"}</CardTitle>
          <CardDescription>Rol seçimi sonrası KVKK ve ses klon izinleri istenecek.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/kayit?role=student" className={`rounded-xl border p-3 text-sm text-center ${role === "student" ? "bg-zinc-900 text-white" : "bg-white"}`}>Öğrenciyim</Link>
            <Link href="/kayit?role=teacher" className={`rounded-xl border p-3 text-sm text-center ${role === "teacher" ? "bg-zinc-900 text-white" : "bg-white"}`}>Öğretmenim</Link>
          </div>
          <form className="space-y-3">
            <input placeholder="Ad Soyad" className="w-full rounded-xl border px-4 py-3 text-sm" />
            <input placeholder="E-posta" type="email" className="w-full rounded-xl border px-4 py-3 text-sm" />
            <input placeholder="Şifre" type="password" className="w-full rounded-xl border px-4 py-3 text-sm" />
            {role === "student" && (
              <select className="w-full rounded-xl border px-4 py-3 text-sm">
                <option>LGS</option>
                <option>YKS</option>
                <option>Diğer</option>
              </select>
            )}
            {role === "teacher" && (
              <>
                <input placeholder="Branş (örn: Matematik)" className="w-full rounded-xl border px-4 py-3 text-sm" />
                <input placeholder="IBAN (hakediş için)" className="w-full rounded-xl border px-4 py-3 text-sm" />
              </>
            )}
            <label className="flex gap-2 text-xs text-zinc-600">
              <input type="checkbox" required /> KVKK Aydınlatma Metnini okudum, onaylıyorum. (v1.0)
            </label>
            {role === "teacher" && (
              <label className="flex gap-2 text-xs text-zinc-600">
                <input type="checkbox" /> Sesimin AI klonum için kullanılmasına açık rıza veriyorum (isteğe bağlı, sonra da verilebilir).
              </label>
            )}
            <Button className="w-full" type="submit">Hesap Oluştur</Button>
          </form>
          <div className="text-center text-sm text-zinc-500">
            Zaten hesabın var mı? <Link href="/giris" className="font-medium text-zinc-900">Giriş Yap</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
