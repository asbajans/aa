/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, liveSessions, teacherProfiles, enrollments } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

async function requireTeacher() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "teacher" && session.user.role !== "superadmin") redirect("/ogrenci");
  return session.user;
}

export async function createClass(formData: FormData) {
  const user = await requireTeacher();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  const level = String(formData.get("level") || "lgs") as "lgs" | "yks" | "other";
  const priceCredits = parseInt(String(formData.get("priceCredits") || "0"), 10);
  const capacity = Math.min(10, Math.max(1, parseInt(String(formData.get("capacity") || "10"), 10)));
  if (!title || !categoryId || !priceCredits) throw new Error("Başlık, kategori ve fiyat zorunlu");
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(6)}`;
  await db.insert(classes).values({
    id: nanoid(),
    teacherId: user.id,
    categoryId,
    title,
    slug,
    description,
    level,
    capacity,
    priceCredits,
    status: "published",
  });
  revalidatePath("/ogretmen");
  revalidatePath("/kesfet");
  revalidatePath("/superadmin/siniflar");
}

export async function createLiveSession(formData: FormData) {
  const user = await requireTeacher();
  const classId = String(formData.get("classId") || "");
  const title = String(formData.get("title") || "").trim();
  const scheduledAtRaw = String(formData.get("scheduledAt") || "");
  if (!classId || !title || !scheduledAtRaw) throw new Error("Sınıf, başlık ve tarih zorunlu");
  const scheduledAt = new Date(scheduledAtRaw);
  if (isNaN(scheduledAt.getTime())) throw new Error("Geçersiz tarih");
  // check ownership
  const cls = await db.select().from(classes).where(eq(classes.id, classId)).limit(1);
  if (!cls[0] || (cls[0].teacherId !== user.id && user.role !== "superadmin")) throw new Error("Yetki yok");
  const room = `class-${classId}-${Date.now()}`;
  await db.insert(liveSessions).values({
    id: nanoid(),
    classId,
    teacherId: user.id,
    title,
    livekitRoom: room,
    scheduledAt,
    status: "scheduled",
    maxParticipants: 10,
  });
  revalidatePath("/ogretmen");
  revalidatePath("/ogrenci");
}

export async function updateTeacherPricing(formData: FormData) {
  const user = await requireTeacher();
  const hourly = parseInt(String(formData.get("hourlyPriceCredits") || "60"), 10);
  const enrollmentFee = parseInt(String(formData.get("enrollmentFeeCredits") || "0"), 10);
  const bioDetail = String(formData.get("bioDetail") || "");
  // ensure profile exists
  const existing = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, user.id)).limit(1);
  if (!existing[0]) {
    await db.insert(teacherProfiles).values({
      id: nanoid(),
      userId: user.id,
      hourlyPriceCredits: hourly,
      enrollmentFeeCredits: enrollmentFee,
      bioDetail,
    });
  } else {
    await db.update(teacherProfiles).set({ hourlyPriceCredits: hourly, enrollmentFeeCredits: enrollmentFee, bioDetail, updatedAt: new Date() }).where(eq(teacherProfiles.userId, user.id));
  }
  revalidatePath("/ogretmen");
}

export async function updateWeeklySchedule(formData: FormData) {
  const user = await requireTeacher();
  const scheduleRaw = String(formData.get("weeklySchedule") || "[]");
  let schedule: { day: number; start: string; end: string }[] = [];
  try { schedule = JSON.parse(scheduleRaw); } catch {}
  await db.update(teacherProfiles).set({ weeklySchedule: schedule as any, updatedAt: new Date() }).where(eq(teacherProfiles.userId, user.id));
  revalidatePath("/ogretmen");
}

export async function approveEnrollment(enrollmentId: string, approve: boolean) {
  const user = await requireTeacher();
  const enr = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1);
  if (!enr[0]) throw new Error("Başvuru yok");
  const cls = await db.select().from(classes).where(eq(classes.id, enr[0].classId)).limit(1);
  if (!cls[0] || cls[0].teacherId !== user.id) throw new Error("Yetki yok");
  if (!approve) {
    await db.update(enrollments).set({ status: "cancelled" }).where(eq(enrollments.id, enrollmentId));
  } else {
    // Onay: kredi kontrolü ve düşme, hakediş oluştur
    const price = cls[0].priceCredits;
    // student credits
    const { userCredits, creditTransactions, wallets, ledgerEntries } = await import("@/lib/db/schema");
    const sc = await db.select().from(userCredits).where(eq(userCredits.userId, enr[0].studentId)).limit(1);
    const bal = sc[0]?.balance || 0;
    if (bal < price) throw new Error(`Öğrencide yeterli kredi yok (${bal} < ${price})`);
    // düş
    await db.update(userCredits).set({ balance: bal - price, totalSpent: (sc[0]?.totalSpent || 0) + price, updatedAt: new Date() }).where(eq(userCredits.userId, enr[0].studentId));
    await db.insert(creditTransactions).values({
      id: nanoid(),
      userId: enr[0].studentId,
      type: "debit",
      amount: price,
      balanceAfter: bal - price,
      reason: "live_lesson",
      refId: cls[0].id,
      description: `Sınıf kaydı: ${cls[0].title}`,
    });
    // öğretmen hakediş (pending 7 gün)
    const prof = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, user.id)).limit(1);
    const rate = prof[0]?.commissionRateLive || 20;
    const gross = price; // kredi ≈ TL varsayımı
    const fee = Math.round((gross * rate) / 100);
    const net = gross - fee;
    // wallet pending
    const w = await db.select().from(wallets).where(eq(wallets.userId, user.id)).limit(1);
    if (!w[0]) await db.insert(wallets).values({ userId: user.id, pendingTry: String(net) as any, totalEarnedTry: String(net) as any });
    else await db.update(wallets).set({ pendingTry: String(Number(w[0].pendingTry) + net) as any, totalEarnedTry: String(Number(w[0].totalEarnedTry) + net) as any }).where(eq(wallets.userId, user.id));
    await db.insert(ledgerEntries).values({
      id: nanoid(),
      walletUserId: user.id,
      amountTry: String(net) as any,
      type: "earning",
      source: "live",
      sourceId: enr[0].id,
      description: `Öğrenci kaydı: ${cls[0].title}`,
      status: "pending",
      availableAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await db.update(enrollments).set({ status: "active" }).where(eq(enrollments.id, enrollmentId));
  }
  revalidatePath("/ogretmen");
  revalidatePath("/ogrenci");
  revalidatePath("/superadmin");
}
