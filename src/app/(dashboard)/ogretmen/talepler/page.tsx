import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { db } from "@/lib/db";
import { oneOnOneRequests, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { handleOneOnOne } from "../actions";

export const dynamic = "force-dynamic";

export default async function OgretmenTaleplerPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") redirect("/ogrenci");

  const rows = await db.select().from(oneOnOneRequests).where(eq(oneOnOneRequests.teacherId, session.user.id)).orderBy(oneOnOneRequests.createdAt).limit(50).catch(() => []);
  const studentIds = [...new Set(rows.map((r) => r.studentId))];
  const students = studentIds.length ? await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.role, "student")).catch(() => []) : [];
  const nameOf = (sid: string) => students.find((s) => s.id === sid)?.name || sid;

  const pending = rows.filter((r) => r.status === "pending");
  const proposed = rows.filter((r) => r.status === "proposed");
  const confirmed = rows.filter((r) => r.status === "confirmed");
  const done = rows.filter((r) => ["completed", "rejected", "cancelled"].includes(r.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">1-1 Ders Talepleri</h1>
        <p className="text-sm text-zinc-600">Talebe tarih/saat öner → öğrenci onaylayınca kredi düşer, hakedişin yazılır.</p>
      </div>

      {[
        { title: "Yeni Talepler", items: pending, tone: "amber" },
        { title: "Tarih Önerildi — Öğrenci Onayı Bekleniyor", items: proposed, tone: "violet" },
        { title: "Onaylandı", items: confirmed, tone: "emerald" },
        { title: "Kapananlar", items: done, tone: "zinc" },
      ].map((group) => (
        <Card key={group.title}>
          <CardHeader><CardTitle className="text-base">{group.title} ({group.items.length})</CardTitle><CardDescription>{group.tone === "amber" ? "Tarih öner veya reddet." : group.tone === "violet" ? "Öğrenci onaylayınca otomatik kredi düşer." : ""}</CardDescription></CardHeader>
          <CardContent>
            {group.items.length === 0 ? <div className="text-sm text-zinc-500">Kayıt yok.</div> : (
              <div className="space-y-2">
                {group.items.map((r: any) => (
                  <div key={r.id} className="flex flex-wrap justify-between items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3">
                    <div>
                      <div className="font-medium text-zinc-900">{nameOf(r.studentId)} • {r.priceCredits} kredi • {r.durationMinutes}dk</div>
                      <div className="text-xs text-zinc-500">{r.message || "—"} {r.proposedTime ? `• Önerilen: ${new Date(r.proposedTime).toLocaleString("tr-TR")}` : ""}</div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      {r.status === "pending" && (
                        <>
                          <form action={handleOneOnOne} className="flex gap-1 items-center">
                            <input type="hidden" name="id" value={r.id} />
                            <input type="hidden" name="action" value="propose" />
                            <input name="proposedTime" type="datetime-local" required className="rounded-lg border border-zinc-200 px-2 py-1 text-xs" />
                            <Button size="sm" type="submit">Öner</Button>
                          </form>
                          <form action={handleOneOnOne}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="action" value="reject" /><Button size="sm" variant="outline" type="submit">Reddet</Button></form>
                        </>
                      )}
                      {r.status === "proposed" && <Badge className="bg-violet-50 text-violet-700 border-violet-200">Öğrenci bekliyor</Badge>}
                      {r.status === "confirmed" && (
                        <>
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Onaylandı</Badge>
                          <Link href={`/canli?room=1o1-${r.id}`}><Button size="sm">Derse Gir</Button></Link>
                          <form action={handleOneOnOne}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="action" value="complete" /><Button size="sm" variant="outline" type="submit">Tamamlandı</Button></form>
                        </>
                      )}
                      {["rejected", "cancelled"].includes(r.status) && <Badge>{r.status}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
