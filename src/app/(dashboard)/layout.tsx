import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="h-8 w-8 grid place-items-center rounded-lg bg-zinc-900 text-white"><GraduationCap size={16} /></span>
            akademi.biz.tr
          </Link>
          <div className="text-sm text-zinc-500">Panel — rol bazlı navigasyon (auth sonrası dinamik)</div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
