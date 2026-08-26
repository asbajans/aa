/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { teacherSubscriptions, oneOnOneRequests, teacherProfiles, userCredits, creditTransactions, wallets, ledgerEntries } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

async function requireStudent() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user) redirect("/giris");
  if (session.user.role !== "student" && session.user.role !== "superadmin") throw new Error("Sadece öğrenciler");
  return session.user;
}

export async function subscribeToTeacher(formData: FormData) {
  const user = await requireStudent();
  const teacherId = String(formData.get("teacherId") || "");
  if (!teacherId) throw new Error("Öğretmen yok");
  const prof = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, teacherId)).limit(1);
  const price = prof[0]?.teacherSubscriptionPriceCredits || 199;
  const limit = prof[0]?.cloneAccessLimit || 50;
  const existing = await db.select().from(teacherSubscriptions).where(and(eq(teacherSubscriptions.teacherId, teacherId), eq(teacherSubscriptions.studentId, user.id))).limit(1);
  if (existing[0]?.status === "active") throw new Error("Zaten abonesin");
  const sc = await db.select().from(userCredits).where(eq(userCredits.userId, user.id)).limit(1);
  const bal = sc[0]?.balance || 0;
  if (bal < price) throw new Error(`Yetersiz kredi (${bal} < ${price}) - paket al`);
  await db.update(userCredits).set({ balance: bal - price, totalSpent: (sc[0]?.totalSpent || 0) + price }).where(eq(userCredits.userId, user.id));
  await db.insert(creditTransactions).values({ id: nanoid(), userId: user.id, type: "debit", amount: price, balanceAfter: bal - price, reason: "ai_clone_chat", refId: teacherId, description: `Öğretmene abonelik` });
  // hakediş öğretmene
  const rate = prof[0]?.commissionRateAi || 30;
  const net = price - Math.round((price * rate) / 100);
  const w = await db.select().from(wallets).where(eq(wallets.userId, teacherId)).limit(1);
  if (!w[0]) await db.insert(wallets).values({ userId: teacherId, pendingTry: String(net) as any, totalEarnedTry: String(net) as any });
  else await db.update(wallets).set({ pendingTry: String(Number(w[0].pendingTry) + net) as any, totalEarnedTry: String(Number(w[0].totalEarnedTry) + net) as any }).where(eq(wallets.userId, teacherId));
  await db.insert(ledgerEntries).values({ id: nanoid(), walletUserId: teacherId, amountTry: String(net) as any, type: "earning", source: "ai", sourceId: user.id, description: "Öğretmen aboneliği", status: "pending", availableAt: new Date(Date.now() + 7 * 86400000) });
  // upsert subscription
  if (existing[0]) await db.update(teacherSubscriptions).set({ status: "active", pricePaid: price, cloneAccessLimit: limit, cloneAccessUsed: 0, startedAt: new Date() }).where(eq(teacherSubscriptions.id, existing[0].id));
  else await db.insert(teacherSubscriptions).values({ id: nanoid(), teacherId, studentId: user.id, status: "active", pricePaid: price, cloneAccessLimit: limit, cloneAccessUsed: 0 });
}

export async function requestOneOnOne(formData: FormData) {
  const user = await requireStudent();
  const teacherId = String(formData.get("teacherId") || "");
  const message = String(formData.get("message") || "");
  const duration = parseInt(String(formData.get("duration") || "60"), 10);
  if (!teacherId) throw new Error("Öğretmen yok");
  const prof = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, teacherId)).limit(1);
  const price = prof[0]?.oneOnOnePriceCredits || prof[0]?.hourlyPriceCredits || 80;
  await db.insert(oneOnOneRequests).values({ id: nanoid(), teacherId, studentId: user.id, status: "pending", message, durationMinutes: duration, priceCredits: price });
}

export async function confirmOneOnOne(formData: FormData) {
  const user = await requireStudent();
  const id = String(formData.get("id") || "");
  const row = await db.select().from(oneOnOneRequests).where(eq(oneOnOneRequests.id, id)).limit(1);
  if (!row[0] || row[0].studentId !== user.id) throw new Error("Yetki yok");
  if (row[0].status !== "proposed" || !row[0].proposedTime) throw new Error("Öğretmen henüz tarih önermedi");
  const sc = await db.select().from(userCredits).where(eq(userCredits.userId, user.id)).limit(1);
  const bal = sc[0]?.balance || 0;
  if (bal < row[0].priceCredits) throw new Error(`Yetersiz kredi (${bal} < ${row[0].priceCredits})`);
  await db.update(userCredits).set({ balance: bal - row[0].priceCredits, totalSpent: (sc[0]?.totalSpent || 0) + row[0].priceCredits }).where(eq(userCredits.userId, user.id));
  await db.insert(creditTransactions).values({ id: nanoid(), userId: user.id, type: "debit", amount: row[0].priceCredits, balanceAfter: bal - row[0].priceCredits, reason: "live_lesson", refId: row[0].teacherId, description: "1-1 ders onayı" });
  const prof = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, row[0].teacherId)).limit(1);
  const rate = prof[0]?.commissionRateLive || 20;
  const net = row[0].priceCredits - Math.round((row[0].priceCredits * rate) / 100);
  const w = await db.select().from(wallets).where(eq(wallets.userId, row[0].teacherId)).limit(1);
  if (!w[0]) await db.insert(wallets).values({ userId: row[0].teacherId, pendingTry: String(net) as any, totalEarnedTry: String(net) as any });
  else await db.update(wallets).set({ pendingTry: String(Number(w[0].pendingTry) + net) as any, totalEarnedTry: String(Number(w[0].totalEarnedTry) + net) as any }).where(eq(wallets.userId, row[0].teacherId));
  await db.insert(ledgerEntries).values({ id: nanoid(), walletUserId: row[0].teacherId, amountTry: String(net) as any, type: "earning", source: "live", sourceId: row[0].id, description: "1-1 ders", status: "pending", availableAt: new Date(Date.now() + 86400000 * 7) });
  await db.update(oneOnOneRequests).set({ status: "confirmed", studentConfirmed: true, updatedAt: new Date() }).where(eq(oneOnOneRequests.id, id));
}
