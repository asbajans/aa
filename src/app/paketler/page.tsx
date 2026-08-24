import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pkgs = [
  { name: "Başlangıç", credits: 100, price: "499₺", bonus: "", featured: false },
  { name: "Popüler", credits: 300, price: "1.299₺", bonus: "+50 bonus", featured: true },
  { name: "Yoğun", credits: 600, price: "2.299₺", bonus: "+150 bonus", featured: false },
  { name: "Sınırsız Aylık", credits: 2000, price: "3.999₺", bonus: "+500 bonus", featured: false },
];

export default function PaketlerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Paketler & Krediler</h1>
      <p className="text-zinc-600">SuperAdmin’den yönetilir. Iyzico/PayTR/Stripe + manuel ekleme aktif. 1 kredi ≈ 5₺ (örnek).</p>
      <div className="mt-8 grid md:grid-cols-4 gap-4">
        {pkgs.map((p) => (
          <Card key={p.name} className={p.featured ? "border-violet-300 bg-violet-50/50" : ""}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">{p.name} {p.featured && <Badge>Popüler</Badge>}</CardTitle>
              <CardDescription>{p.credits} kredi {p.bonus && <span className="text-violet-600">• {p.bonus}</span>}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{p.price}</div>
              <div className="text-xs text-zinc-500">365 gün geçerli • Canlı ders ~60 kredi/saat • AI klon ~2 kredi/dk</div>
              <Button className="w-full mt-4">Satın Al</Button>
              <div className="text-xs text-zinc-400 mt-2 text-center">Ödeme: Iyzico • PayTR • Stripe • Havale</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
