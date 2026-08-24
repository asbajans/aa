import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <GraduationCap size={20} />
          </span>
          akademi<span className="text-zinc-400">.biz.tr</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/kesfet" className="hover:text-zinc-900">Sınıflar</Link>
          <Link href="/ogretmenler" className="hover:text-zinc-900">Öğretmenler</Link>
          <Link href="/paketler" className="hover:text-zinc-900">Paketler</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/giris"><Button variant="ghost">Giriş Yap</Button></Link>
          <Link href="/kayit"><Button>Kayıt Ol</Button></Link>
        </div>
      </div>
    </header>
  );
}
