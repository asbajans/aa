/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { classes, liveSessions, teacherProfiles, enrollments, categories } from "@/lib/db/schema";
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
  // Ders periyodu
  const scheduleType = String(formData.get("scheduleType") || "weekly") as "weekly" | "monthly" | "none";
  const scheduleDays = formData.getAll("scheduleDays").map((d) => parseInt(String(d), 10)).filter((n) => !isNaN(n));
  const scheduleMonthDays = String(formData.get("scheduleMonthDays") || "").split(",").map((x) => parseInt(x.trim(), 10)).filter((n) => !isNaN(n) && n >= 1 && n <= 31);
  const scheduleTime = String(formData.get("scheduleTime") || "18:00");
  const durationMinutes = Math.max(15, parseInt(String(formData.get("durationMinutes") || "60"), 10));
  if (!title || !categoryId || !priceCredits) throw new Error("Başlık, kategori ve fiyat zorunlu");
  if (scheduleType === "weekly" && scheduleDays.length === 0) throw new Error("Haftalık periyot için en az bir gün seç");
  if (scheduleType === "monthly" && scheduleMonthDays.length === 0) throw new Error("Aylık periyot için gün gir (örn: 5,15,25)");
  // Branş kontrolü: atanmış branş varsa sadece o branşlarda açabilir
  const prof = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, user.id)).limit(1);
  const assigned = (prof[0]?.branches as string[] | null) || [];
  if (assigned.length > 0 && user.role !== "superadmin") {
    const cat = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
    if (!cat[0] || !assigned.includes(cat[0].nameTr)) throw new Error(`Bu branşta sınıf açma yetkin yok. Atanan branşlar: ${assigned.join(", ")}`);
  }
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(6)}`;
  const classId = nanoid();
  await db.insert(classes).values({
    id: classId,
    teacherId: user.id,
    categoryId,
    title,
    slug,
    description,
    level,
    capacity,
    priceCredits,
    status: "published",
    scheduleType,
    scheduleDays: scheduleDays as any,
    scheduleMonthDays: scheduleMonthDays as any,
    scheduleTime,
    durationMinutes,
  });
  // Periyoda göre ilk 4 canlı dersi otomatik oluştur
  const { generateNextDates } = await import("@/lib/schedule");
  const dates = generateNextDates(scheduleType, scheduleDays, scheduleMonthDays, scheduleTime, 4);
  const { liveSessions } = await import("@/lib/db/schema");
  for (const d of dates) {
    await db.insert(liveSessions).values({
      id: nanoid(),
      classId,
      teacherId: user.id,
      title: `${title} — ${d.toLocaleDateString("tr-TR")}`,
      livekitRoom: `class-${classId}-${d.getTime()}`,
      scheduledAt: d,
      status: "scheduled",
      maxParticipants: capacity,
    });
  }
  revalidatePath("/ogretmen");
  revalidatePath("/ogretmen/siniflar");
  revalidatePath("/ogretmen/canli");
  revalidatePath("/kesfet");
  revalidatePath("/ogrenci/kesfet");
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
  const oneOnOne = parseInt(String(formData.get("oneOnOnePriceCredits") || String(hourly)), 10);
  const teacherSub = parseInt(String(formData.get("teacherSubscriptionPriceCredits") || "199"), 10);
  const cloneLimit = parseInt(String(formData.get("cloneAccessLimit") || "50"), 10);
  const bioDetail = String(formData.get("bioDetail") || "");
  const existing = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, user.id)).limit(1);
  if (!existing[0]) {
    await db.insert(teacherProfiles).values({
      id: nanoid(),
      userId: user.id,
      hourlyPriceCredits: hourly,
      oneOnOnePriceCredits: oneOnOne,
      teacherSubscriptionPriceCredits: teacherSub,
      cloneAccessLimit: cloneLimit,
      bioDetail,
    });
  } else {
    await db.update(teacherProfiles).set({ hourlyPriceCredits: hourly, oneOnOnePriceCredits: oneOnOne, teacherSubscriptionPriceCredits: teacherSub, cloneAccessLimit: cloneLimit, bioDetail, updatedAt: new Date() }).where(eq(teacherProfiles.userId, user.id));
  }
  revalidatePath("/ogretmen");
  revalidatePath(`/ogretmenler/${user.id}`);
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

export async function updateClass(formData: FormData) {
  const user = await requireTeacher();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceCredits = parseInt(String(formData.get("priceCredits") || "0"), 10);
  if (!id || !title) throw new Error("Eksik bilgi");
  const cls = await db.select().from(classes).where(eq(classes.id, id)).limit(1);
  if (!cls[0] || cls[0].teacherId !== user.id) throw new Error("Yetki yok");
  await db.update(classes).set({ title, description, priceCredits: priceCredits || cls[0].priceCredits, updatedAt: new Date() }).where(eq(classes.id, id));
  revalidatePath("/ogretmen");
  revalidatePath("/kesfet");
}

export async function requestClassDeletion(formData: FormData) {
  const user = await requireTeacher();
  const id = String(formData.get("id") || "");
  const reason = String(formData.get("reason") || "");
  const cls = await db.select().from(classes).where(eq(classes.id, id)).limit(1);
  if (!cls[0] || cls[0].teacherId !== user.id) throw new Error("Yetki yok");
  await db.update(classes).set({ deletionRequested: true, deletionRequestedAt: new Date(), deletionReason: reason, updatedAt: new Date() }).where(eq(classes.id, id));
  revalidatePath("/ogretmen");
  revalidatePath("/superadmin/siniflar");
}

export async function requestLiveSessionDeletion(formData: FormData) {
  const user = await requireTeacher();
  const id = String(formData.get("id") || "");
  const s = await db.select().from(liveSessions).where(eq(liveSessions.id, id)).limit(1);
  if (!s[0] || s[0].teacherId !== user.id) throw new Error("Yetki yok");
  await db.update(liveSessions).set({ deletionRequested: true, deletionRequestedAt: new Date() }).where(eq(liveSessions.id, id));
  revalidatePath("/ogretmen");
}

// 1-1 talebi için öğretmen tarafı: tarih öner / reddet
export async function handleOneOnOne(formData: FormData) {
  const user = await requireTeacher();
  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || ""); // propose / reject / complete
  const proposedTimeRaw = String(formData.get("proposedTime") || "");
  const { oneOnOneRequests } = await import("@/lib/db/schema");
  const reqRow = await db.select().from(oneOnOneRequests).where(eq(oneOnOneRequests.id, id)).limit(1);
  if (!reqRow[0] || reqRow[0].teacherId !== user.id) throw new Error("Yetki yok");
  if (action === "reject") {
    await db.update(oneOnOneRequests).set({ status: "rejected", updatedAt: new Date() }).where(eq(oneOnOneRequests.id, id));
  } else if (action === "propose") {
    if (!proposedTimeRaw) throw new Error("Tarih seç");
    const pt = new Date(proposedTimeRaw);
    await db.update(oneOnOneRequests).set({ status: "proposed", proposedTime: pt, updatedAt: new Date() }).where(eq(oneOnOneRequests.id, id));
  } else if (action === "complete") {
    await db.update(oneOnOneRequests).set({ status: "completed", updatedAt: new Date() }).where(eq(oneOnOneRequests.id, id));
  }
  revalidatePath("/ogretmen");
}
