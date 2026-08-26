"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { enrollments, classes } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

export async function enrollToClass(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "student" && session.user.role !== "superadmin") throw new Error("Sadece öğrenciler başvurabilir");
  const classId = String(formData.get("classId") || "");
  const message = String(formData.get("message") || "");
  if (!classId) throw new Error("Sınıf yok");
  const cls = await db.select().from(classes).where(eq(classes.id, classId)).limit(1);
  if (!cls[0]) throw new Error("Sınıf bulunamadı");
  if (cls[0].status !== "published") throw new Error("Sınıf henüz yayında değil");
  // check already enrolled
  const existing = await db.select().from(enrollments).where(and(eq(enrollments.classId, classId), eq(enrollments.studentId, session.user.id))).limit(1);
  if (existing[0]) throw new Error("Zaten başvurun var");
  // check credits for price (optional: allow pending without deducting, deduct on approve)
  // For now, allow pending without credit check, deduct on approve
  await db.insert(enrollments).values({
    id: nanoid(),
    classId,
    studentId: session.user.id,
    status: "pending",
    creditsPaid: cls[0].priceCredits,
    requestMessage: message,
  });
}
