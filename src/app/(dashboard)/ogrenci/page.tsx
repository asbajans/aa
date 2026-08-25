import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Bot, BookOpen } from "lucide-react";

export default function OgrenciPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Öğrenci Paneli — LGS/YKS</h1>
        <p className="text-zinc-600 text-sm">Sınıflarım, canlı dersler, Akademi Klonlarım, kredilerim.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Video size={18} /> Canlı Dersler</CardTitle><CardDescription>Yaklaşan dersler, katılım, kayıt izleme</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full">Derslere Katıl</Button></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Bot size={18} /> Akademi Klonlarım</CardTitle><CardDescription>Öğretmeninin Akademi Klonu ile 7/24 pratik</CardDescription></CardHeader><CardContent><Button className="w-full">Akademi Klonu ile Çalış</Button></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex gap-2 items-center"><BookOpen size={18} /> Sınıflarım</CardTitle><CardDescription>Kayıtlı sınıflar, ödevler, sertifikalar</CardDescription></CardHeader><CardContent><Badge>12 kredi kaldı</Badge></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Akademi Klonu — Fotoğraftan Soru Çöz</CardTitle><CardDescription>Kamera ile soru çek → Akademi Klonu sesle beyaz tahtada çözsün (mobil öncelikli)</CardDescription></CardHeader>
        <CardContent className="text-sm text-zinc-500">Fotoğraf çek, Akademi Klonun anında adım adım anlatsın. Mobil uygulamada kamera izni yeterli.</CardContent>
      </Card>
    </div>
  );
}
