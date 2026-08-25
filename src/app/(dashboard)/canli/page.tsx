import { LiveRoom } from "@/components/livekit/LiveRoom";

export default function CanliPage({ searchParams }: { searchParams: { room?: string } }) {
  const room = searchParams.room || "demo-lgs-matematik";
  // Stabil identity — Date.now() impure fonksiyon lint hatası veriyor, oda adına göre deterministik
  const identity = `user-${room}-demo`;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Canlı Ders — {room} (max 10 kişi)</h1>
      <p className="text-sm text-zinc-500">LiveKit SFU • Cloudflare Tunnel • Kayıt otomatik başlar, beyaz tahta yakında</p>
      <LiveRoom room={room} identity={identity} name="Demo Kullanıcı" />
    </div>
  );
}
