import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SüperAdmin Paneli</h1>
        <p className="text-sm text-zinc-600">Tüm kullanıcılar, sınıflar, paket/kredi, hakediş, Akademi Klonu moderasyon — tek yerden.</p>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Kullanıcılar</CardTitle><CardDescription>Öğrenci/öğretmen CRUD, ban, onayla</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full">Yönet</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Paket & Kredi</CardTitle><CardDescription>Paket tanımla, fiyat/kredi/bonus, manuel kredi ekle</CardDescription></CardHeader><CardContent><Button variant="outline" className="w-full">Paketler</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Hakedişler</CardTitle><CardDescription>Periyot: haftalık/2 hafta/aylık, min tutar, komisyon</CardDescription></CardHeader><CardContent><Badge>Bekleyen: 0</Badge></CardContent></Card>
        <Card className="border-amber-200 bg-amber-50/50"><CardHeader><CardTitle>Akademi Klonu Onayları</CardTitle><CardDescription>Ses izni + içerik denetimi</CardDescription></CardHeader><CardContent><Badge>Onay bekleyen: 0</Badge></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Ödeme Sağlayıcılar</CardTitle><CardDescription>Iyzico / PayTR / Stripe — sandbox/prod anahtarları env’de. Manuel mod aktif.</CardDescription></CardHeader>
        <CardContent className="text-sm space-y-2">
          <div>• Manuel: SuperAdmin kredi ekler (ilk faz)</div>
          <div>• Otomatik: Iyzico/PayTR/Stripe webhook → credit_transactions + payments</div>
          <div>• Banka hakedişi: IBAN’a transfer, dekont yükle, ledger → paid</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Güvenlik & KVKK</CardTitle><CardDescription>Moderatör logları, ses klon izin arşivi, ban geçmişi</CardDescription></CardHeader><CardContent className="text-xs text-zinc-500">Tüm onay/red loglanır, KVKK metin versiyonu saklanır.</CardContent>
      </Card>
    </div>
  );
}
