/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, users, categories } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SuperAdminSiniflarPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || session.user.role !== "superadmin") redirect("/giris");

  let all: any[] = [];
  try {
    all = await db
      .select({ id: classes.id, title: classes.title, status: classes.status, priceCredits: classes.priceCredits, level: classes.level, teacherName: users.name, categoryName: categories.nameTr })
      .from(classes)
      .leftJoin(users, eq(classes.teacherId, users.id))
      .leftJoin(categories, eq(classes.categoryId, categories.id))
      .orderBy(classes.createdAt)
      .limit(100);
  } catch {}

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tüm Sınıflar ({all.length})</h1>
        <Link href="/superadmin"><Button variant="outline">← SüperAdmin</Button></Link>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {all.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{c.title}</CardTitle><div className="text-xs text-zinc-500">{c.categoryName} • {c.level} • {c.teacherName} • {c.priceCredits} kredi</div></CardHeader>
            <CardContent><Badge>{c.status}</Badge></CardContent>
          </Card>
        ))}
        {all.length === 0 && <div className="text-sm text-zinc-500">Henüz sınıf yok.</div>}
      </div>
    </div>
  );
}
