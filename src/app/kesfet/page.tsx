import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function KesfetPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold">Sınıfları Keşfet — LGS & YKS</h1>
      <p className="text-zinc-600 text-sm">Öğretmenler sınıf açar (max 10), sen kredi ile kaydolursun. AI klonu olan sınıflarda 7/24 pratik.</p>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Matematik — {i % 2 ? "LGS" : "YKS"} Sınıf #{i}</CardTitle>
              <CardDescription>Öğretmen • 4.8 ★ • {10 - i} kişilik • Kredi: 120</CardDescription>
            </CardHeader>
            <CardContent><Badge>Canlı + AI Klon</Badge></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
