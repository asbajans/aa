import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { userCredits, creditTransactions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const REASON_TR: Record<string, string> = {
  purchase: "Paket satın alma",
  manual_add: "Manuel kredi ekleme",
  live_lesson: "Canlı ders / sınıf kaydı",
  ai_clone_chat: "Akademi Klonu / abonelik",
  ai_clone_voice: "Klon sesli kullanım",
  assignment_review: "Ödev değerlendirme",
  refund: "İade",
  bonus: "Bonus",
  payout: "Hakediş ödemesi",
};

export default async function OgrenciKredilerPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "student" && session.user.role !== "superadmin") redirect("/ogretmen");

  const credit = await db.select().from(userCredits).where(eq(userCredits.userId, session.user.id)).limit(1).then((r) => r[0]).catch(() => null);
  const history = await db.select().from(creditTransactions).where(eq(creditTransactions.userId, session.user.id)).orderBy(desc(creditTransactions.createdAt)).limit(50).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kredilerim</h1>
          <p className="text-sm text-zinc-600">Bakiye, paketlerin ve tüm kullanım geçmişin.</p>
        </div>
        <Link href="/paketler"><Button>Paket Al</Button></Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 text-sm text-zinc-500"><Coins size={14} /> Mevcut Bakiye</div>
            <div className="text-3xl font-black text-zinc-900 mt-1">{credit?.balance ?? 0} <span className="text-base font-medium text-zinc-400">kredi</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 text-sm text-zinc-500"><ArrowUpCircle size={14} className="text-emerald-600" /> Toplam Yüklenen</div>
            <div className="text-3xl font-black text-zinc-900 mt-1">{credit?.totalEarned ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 text-sm text-zinc-500"><ArrowDownCircle size={14} className="text-red-500" /> Toplam Kullanılan</div>
            <div className="text-3xl font-black text-zinc-900 mt-1">{credit?.totalSpent ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Kullanım Geçmişi</CardTitle><CardDescription>Son 50 işlem — her harcamada kredi düşer, her yüklemede artar.</CardDescription></CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-sm text-zinc-500">Henüz işlem yok — <Link href="/paketler" className="underline">paket al</Link> ile başla.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3">İşlem</th>
                    <th className="px-4 py-3">Detay</th>
                    <th className="px-4 py-3 text-right">Miktar</th>
                    <th className="px-4 py-3 text-right">Bakiye</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {history.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{new Date(t.createdAt).toLocaleString("tr-TR")}</td>
                      <td className="px-4 py-3">
                        <Badge className={t.type === "credit" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                          {t.type === "credit" ? "+" : "−"} {REASON_TR[t.reason] || t.reason}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-600">{t.description || "—"}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${t.type === "credit" ? "text-emerald-600" : "text-red-600"}`}>
                        {t.type === "credit" ? "+" : "−"}{t.amount}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-700">{t.balanceAfter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Kredi nasıl harcanır?</CardTitle></CardHeader>
        <CardContent className="text-sm text-zinc-600 space-y-1">
          <div>• <b>Sınıf aboneliği:</b> Sınıf fiyatı kadar kredi (toplu canlı dersler dahil)</div>
          <div>• <b>Öğretmene abonelik:</b> Öğretmenin belirlediği aylık fiyat (klon erişimi)</div>
          <div>• <b>1-1 ders:</b> Öğrenci onayladığında düşer (abonelere indirimli)</div>
          <div>• <b>Akademi Klonu:</b> Öğretmenin dk fiyatı üzerinden</div>
        </CardContent>
      </Card>
    </div>
  );
}
