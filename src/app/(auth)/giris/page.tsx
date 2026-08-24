import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GirisPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
          <CardDescription>akademi.biz.tr — LGS & YKS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3">
            <input placeholder="E-posta" type="email" className="w-full rounded-xl border px-4 py-3 text-sm" />
            <input placeholder="Şifre" type="password" className="w-full rounded-xl border px-4 py-3 text-sm" />
            <Button className="w-full" type="submit">Giriş Yap</Button>
          </form>
          <div className="text-center text-sm text-zinc-500">
            Hesabın yok mu? <Link href="/kayit" className="font-medium text-zinc-900">Kayıt Ol</Link>
          </div>
          <div className="text-xs text-zinc-400 text-center">better-auth ile email+şifre, yakında Google ile giriş</div>
        </CardContent>
      </Card>
    </div>
  );
}
