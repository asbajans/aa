import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Bot, Wallet, Plus } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function OgretmenPanel() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") {
    redirect(session.user.role === "superadmin" ? "/superadmin" : "/ogrenci");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Öğretmen Paneli</h1>
          <p className="text-zinc-600 text-sm">Hoş geldin {session.user.name} — sınıf aç, canlı ders yap, Akademi Klonunu eğit, kazancını takip et.</p>
        </div>
        <Link href="/ogretmen/ai-klon">
          <Button><Plus size={16} className="mr-1" /> Akademi Klonu Oluştur</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Video size={18} /> Sınıflarım</CardTitle><CardDescription>Başlık, mevcut, fiyat (kredi), müfredat</CardDescription></CardHeader><CardContent className="text-sm text-zinc-500">Henüz sınıf yok — ilk sınıfı oluştur.</CardContent></Card>
        <Card className="border-violet-200 bg-violet-50/50"><CardHeader><CardTitle className="flex gap-2 items-center"><Bot size={18} /> Akademi Klonu Stüdyosu</CardTitle><CardDescription>Ses örneği yükle (2-10 dk) + tarz + püf noktaları + materyal</CardDescription></CardHeader><CardContent><Link href="/ogretmen/ai-klon"><Button className="w-full">Klon Oluştur</Button></Link><div className="mt-2 text-xs text-zinc-500">Durum: taslak → SuperAdmin onayı → yayında</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Wallet size={18} /> Kazançlarım</CardTitle><CardDescription>Canlı %80, Akademi Klonu %70</CardDescription></CardHeader><CardContent><div className="text-2xl font-bold text-zinc-900">₺0,00</div><div className="text-xs text-zinc-500">Bekleyen: ₺0 • Ödenen: ₺0 • Min çekim: ₺500</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Canlı Ders</CardTitle><CardDescription>Oda oluştur, davet et, beyaz tahta, kayıt, yoklama</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/canli?room=demo-lgs-matematik"><Button variant="outline">Demo Odaya Gir</Button></Link>
          <span className="text-sm text-zinc-500 self-center">Sınıf CRUD Faz 1&apos;de aktif olacak.</span>
        </CardContent>
      </Card>
    </div>
  );
}
