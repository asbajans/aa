export function Footer() {
  return (
    <footer className="border-t bg-zinc-50 py-12">
      <div className="mx-auto max-w-6xl px-4 text-sm text-zinc-500">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="font-semibold text-zinc-900">akademi.biz.tr</div>
            <div>LGS & YKS için AI destekli online ders platformu.</div>
            <div className="mt-2">KVKK uyumlu • Ses klonlama açık rıza ile • Güvenli ödeme (Iyzico/PayTR/Stripe)</div>
          </div>
          <div className="text-xs">
            <div>© {new Date().getFullYear()} akademi.biz.tr</div>
            <div>Cloudflare Tunnel • Portainer Stack • Github Deploy</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
