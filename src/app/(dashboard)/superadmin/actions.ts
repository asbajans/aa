"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, userCredits, creditTransactions } from "@/lib/db/schema";
import { nanoid } from "nanoid";

async function requireSuperadmin() {
  const { auth } = await import("@/lib/auth");
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || session.user.role !== "superadmin") {
    redirect("/giris");
  }
  return session.user;
}

export async function toggleBan(userId: string, isBanned: boolean) {
  await requireSuperadmin();
  await db.update(users).set({ isBanned, updatedAt: new Date() }).where(eq(users.id, userId));
  revalidatePath("/superadmin");
  return { ok: true };
}

export async function setRole(userId: string, role: "student" | "teacher" | "superadmin") {
  await requireSuperadmin();
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
  revalidatePath("/superadmin");
  return { ok: true };
}

export async function addCredits(userId: string, amount: number) {
  await requireSuperadmin();
  if (!amount || amount <= 0) return { ok: false, error: "Geçersiz miktar" };

  // Bakiyeyi güncelle
  const updated = await db
    .insert(userCredits)
    .values({ userId, balance: amount })
    .onConflictDoUpdate({
      target: userCredits.userId,
      set: { balance: sql`${userCredits.balance} + ${amount}`, updatedAt: new Date() },
    })
    .returning();

  const balanceAfter = updated[0]?.balance ?? amount;

  await db.insert(creditTransactions).values({
    id: nanoid(),
    userId,
    type: "credit",
    amount,
    balanceAfter,
    reason: "manual_add",
    provider: "manual",
    description: "SuperAdmin manuel kredi ekleme",
  });

  revalidatePath("/superadmin");
  return { ok: true, balanceAfter };
}
