/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiClones, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SuperAdminKlonlarPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || session.user.role !== "superadmin") redirect("/giris");

  let clones: any[] = [];
  try {
    clones = await db.select({ id: aiClones.id, displayName: aiClones.displayName, status: aiClones.status, teacherName: users.name, pricePerMinute: aiClones.pricePerMinute }).from(aiClones).leftJoin(users, eq(aiClones.teacherId, users.id)).limit(50);
  } catch {}

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Akademi Klonları ({clones.length})</h1>
        <Link href="/superadmin"><Button variant="outline">← SüperAdmin</Button></Link>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {clones.map((k) => (
          <Card key={k.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{k.displayName}</CardTitle><div className="text-xs text-zinc-500">{k.teacherName} • {k.pricePerMinute} kredi/dk</div></CardHeader>
            <CardContent className="flex justify-between items-center"><Badge>{k.status}</Badge><Button size="sm" variant="outline" disabled>Onayla (yakında)</Button></CardContent>
          </Card>
        ))}
        {clones.length === 0 && <div className="text-sm text-zinc-500">Henüz klon yok — öğretmenler stüdyodan oluşturduğunda burada görünecek.</div>}
      </div>
    </div>
  );
}
