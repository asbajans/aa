import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030712] text-zinc-400">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <span className="h-8 w-8 grid place-items-center rounded-lg bg-white text-[#030712]"><GraduationCap size={16} /></span>
              akademi.biz.tr
            </div>
            <div className="mt-3 text-zinc-400 leading-relaxed">
              LGS & YKS için AI destekli online akademi.<br />
              Canlı ders (LiveKit, max 10) + öğretmeninin sesiyle ve tarzıyla 7/24 AI klon.
            </div>
            <div className="mt-3 text-xs text-zinc-500">KVKK uyumlu • Ses klonlama açık rıza ile • Iyzico / PayTR / Stripe • Cloudflare Tunnel • Portainer Stack</div>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Platform</div>
            <div className="space-y-2 text-zinc-400">
              <div><Link href="/kesfet" className="hover:text-white">Sınıfları Keşfet</Link></div>
              <div><Link href="/paketler" className="hover:text-white">Paketler</Link></div>
              <div><Link href="/kvkk" className="hover:text-white">KVKK & Açık Rıza</Link></div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-white mb-3">Paneller</div>
            <div className="space-y-2 text-zinc-400">
              <div><Link href="/ogrenci" className="hover:text-white">Öğrenci Paneli</Link></div>
              <div><Link href="/ogretmen" className="hover:text-white">Öğretmen Paneli</Link></div>
              <div><Link href="/ogretmen/ai-klon" className="hover:text-white">AI Klon Stüdyosu</Link></div>
              <div><Link href="/superadmin" className="hover:text-white">SüperAdmin</Link></div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} akademi.biz.tr — Tüm hakları saklıdır.</div>
          <div>24c / 144GB • GPU yok • OpenRouter • 4000–4200 port aralığı</div>
        </div>
      </div>
    </footer>
  );
}
