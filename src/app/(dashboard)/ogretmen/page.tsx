import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Bot, Wallet, Plus } from "lucide-react";

export default function OgretmenPanel() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Öğretmen Paneli</h1>
          <p className="text-zinc-600 text-sm">Sınıf aç, canlı ders yap, Akademi Klonunu eğit, kazancını takip et.</p>
        </div>
        <Button><Plus size={16} className="mr-1" /> Sınıf Oluştur</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Video size={18} /> Sınıflarım</CardTitle><CardDescription>Başlık, kapasite (max 10), fiyat (kredi), müfredat</CardDescription></CardHeader><CardContent className="text-sm text-zinc-500">Henüz sınıf yok — ilk sınıfı oluştur.</CardContent></Card>
        <Card className="border-violet-200 bg-violet-50/50"><CardHeader><CardTitle className="flex gap-2 items-center"><Bot size={18} /> Akademi Klonu Stüdyosu</CardTitle><CardDescription>Ses örneği yükle (2-10 dk) + tarz + püf noktaları + materyal</CardDescription></CardHeader><CardContent><Button className="w-full">Klon Oluştur</Button><div className="mt-2 text-xs text-zinc-500">Durum: taslak → SuperAdmin onayı → yayında</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Wallet size={18} /> Kazançlarım</CardTitle><CardDescription>Canlı %80, Akademi Klonu %70</CardDescription></CardHeader><CardContent><div className="text-2xl font-bold">₺0,00</div><div className="text-xs text-zinc-500">Bekleyen: ₺0 • Ödenen: ₺0 • Min çekim: ₺500</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Canlı Ders — LiveKit (max 10)</CardTitle><CardDescription>Oda oluştur, davet et, beyaz tahta, kayıt, yoklama</CardDescription></CardHeader>
        <CardContent className="text-sm text-zinc-500">POST /api/livekit/token → oda: classId-timestamp, token al, client ile bağlan.</CardContent>
      </Card>
    </div>
  );
}
