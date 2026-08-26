"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

async function requireSuperadmin() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || session.user.role !== "superadmin") redirect("/giris");
  return session.user;
}

export async function createPackage(formData: FormData) {
  await requireSuperadmin();
  const nameTr = String(formData.get("nameTr") || "").trim();
  const credits = parseInt(String(formData.get("credits") || "0"), 10);
  const bonusCredits = parseInt(String(formData.get("bonusCredits") || "0"), 10);
  const priceTry = String(formData.get("priceTry") || "0");
  const validDays = parseInt(String(formData.get("validDays") || "365"), 10);
  const isFeatured = formData.get("isFeatured") === "on";
  if (!nameTr || !credits || !priceTry) throw new Error("Zorunlu alanlar eksik");
  await db.insert(packages).values({
    id: nanoid(),
    nameTr,
    credits,
    bonusCredits,
    priceTry,
    validDays,
    isFeatured,
    isActive: true,
  });
  revalidatePath("/superadmin/paketler");
  revalidatePath("/paketler");
}

export async function togglePackageActive(id: string, isActive: boolean) {
  await requireSuperadmin();
  await db.update(packages).set({ isActive }).where(eq(packages.id, id));
  revalidatePath("/superadmin/paketler");
  revalidatePath("/paketler");
}

export async function deletePackage(id: string) {
  await requireSuperadmin();
  await db.delete(packages).where(eq(packages.id, id));
  revalidatePath("/superadmin/paketler");
  revalidatePath("/paketler");
}

export async function setPackageFeatured(id: string, isFeatured: boolean) {
  await requireSuperadmin();
  await db.update(packages).set({ isFeatured }).where(eq(packages.id, id));
  revalidatePath("/superadmin/paketler");
}
