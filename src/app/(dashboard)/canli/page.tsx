import Link from "next/link";
import { LiveRoom } from "@/components/livekit/LiveRoom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CanliPage({ searchParams }: { searchParams: Promise<{ room?: string }> }) {
  const { room: roomParam } = await searchParams;
  const room = roomParam || "";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Canlı Ders Odası</h1>
        <p className="text-sm text-zinc-600">Sınıf dersi veya 1-1 ders — max 10 kişi, düşük gecikme.</p>
      </div>

      <Card className="border-violet-200 bg-violet-50/50">
        <CardContent className="pt-5 text-sm text-zinc-700 space-y-1">
          <div><b>Derslere nereden girilir?</b></div>
          <div>• <b>Öğretmen:</b> Sol menü → <Link href="/ogretmen/canli" className="underline font-medium">Canlı Dersler</Link> → dersin yanındaki <b>Odaya Gir</b>. 1-1 onaylı dersler için → <Link href="/ogretmen/talepler" className="underline font-medium">1-1 Talepler</Link> → <b>Derse Gir</b>.</div>
          <div>• <b>Öğrenci:</b> Sol menü → <Link href="/ogrenci/program" className="underline font-medium">Programım</Link> → canlı ders veya onaylı 1-1 yanındaki <b>Katıl / Derse Gir</b>.</div>
          <div>• Aşağıdan oda kodu ile de katılabilirsin (öğretmen paylaştıysa).</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Oda Kodu ile Katıl</CardTitle><CardDescription>Öğretmen bir oda kodu paylaştıysa buraya yaz.</CardDescription></CardHeader>
        <CardContent>
          <form method="get" className="flex gap-2">
            <input name="room" defaultValue={room} placeholder="örn: 1o1-abc123 veya class-xxx" className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <Button type="submit">Odaya Gir</Button>
          </form>
        </CardContent>
      </Card>

      {room ? (
        <>
          <h2 className="text-lg font-semibold">Oda: {room}</h2>
          <LiveRoom room={room} identity={`user-${room}-demo`} name="Kullanıcı" />
        </>
      ) : (
        <Card>
          <CardContent className="pt-6 text-sm text-zinc-500">Bir oda seç — yukarıdaki bağlantılardan dersine git veya oda kodu gir.</CardContent>
        </Card>
      )}
    </div>
  );
}
