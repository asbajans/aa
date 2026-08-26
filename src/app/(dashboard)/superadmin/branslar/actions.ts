/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, teacherProfiles } from "@/lib/db/schema";
import { nanoid } from "nanoid";
import { auth } from "@/lib/auth";

async function requireSuperadmin() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (!session?.user || session.user.role !== "superadmin") redirect("/giris");
  return session.user;
}

export async function createBranch(formData: FormData) {
  await requireSuperadmin();
  const nameTr = String(formData.get("nameTr") || "").trim();
  const level = String(formData.get("level") || "lgs") as "lgs" | "yks" | "other";
  const icon = String(formData.get("icon") || "").trim();
  if (!nameTr) throw new Error("Branş adı zorunlu");
  const slug = `${nameTr.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(4)}`;
  await db.insert(categories).values({ id: nanoid(), nameTr, slug, level, icon: icon || null, isActive: true });
  revalidatePath("/superadmin/branslar");
  revalidatePath("/ogretmen");
}

export async function toggleBranchActive(id: string, isActive: boolean) {
  await requireSuperadmin();
  await db.update(categories).set({ isActive }).where(eq(categories.id, id));
  revalidatePath("/superadmin/branslar");
}

export async function deleteBranch(id: string) {
  await requireSuperadmin();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/superadmin/branslar");
}

export async function assignBranchesToTeacher(formData: FormData) {
  await requireSuperadmin();
  const teacherId = String(formData.get("teacherId") || "");
  const branchesRaw = formData.getAll("branches") as string[];
  if (!teacherId) throw new Error("Öğretmen seç");
  // branchesRaw is array of category nameTr or slug? Use nameTr for simplicity, as teacherProfiles.branches stores string[]
  await db.update(teacherProfiles).set({ branches: branchesRaw as any, updatedAt: new Date() }).where(eq(teacherProfiles.userId, teacherId));
  // If profile doesn't exist, create it
  const existing = await db.select().from(teacherProfiles).where(eq(teacherProfiles.userId, teacherId)).limit(1);
  if (!existing[0]) {
    await db.insert(teacherProfiles).values({ id: nanoid(), userId: teacherId, branches: branchesRaw as any });
  }
  revalidatePath("/superadmin/branslar");
  revalidatePath("/ogretmen");
}
