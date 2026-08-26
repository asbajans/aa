import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030712] text-zinc-400">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <span className="h-8 w-8 grid place-items-center rounded-lg bg-white p-1 overflow-hidden"><img src="/logo.png" alt="akademi.biz.tr" className="h-full w-full object-contain" /></span>
              akademi.biz.tr
            </div>
            <div className="mt-3 text-zinc-400 leading-relaxed">
              LGS & YKS için online akademi.<br />
              Canlı ders + öğretmeninin sesiyle ve tarzıyla 7/24 Akademi Klonu.
            </div>
            <div className="mt-3 text-xs text-zinc-500">KVKK uyumlu • Güvenli ödeme • 7/24 destek</div>
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
            <div className="font-semibold text-white mb-3">Destek</div>
            <div className="space-y-2 text-zinc-400">
              <div><Link href="/giris" className="hover:text-white">Giriş Yap</Link></div>
              <div><Link href="/kayit" className="hover:text-white">Kayıt Ol</Link></div>
              <div><Link href="/kesfet" className="hover:text-white">Nasıl Çalışır?</Link></div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} akademi.biz.tr — Tüm hakları saklıdır.</div>
          <div>Güvenli • Hızlı • Destek her zaman</div>
        </div>
      </div>
    </footer>
  );
}
