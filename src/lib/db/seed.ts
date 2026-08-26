/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./index";
import { categories, packages, payoutSettings, users, accounts, teacherProfiles, studentProfiles, userCredits, wallets } from "./schema";
import { nanoid } from "nanoid";
import { randomBytes, scrypt } from "node:crypto";

// better-auth ile aynı format: "salt:key" (scrypt, hex)
function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, 64, { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 }, (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

async function upsertUser(opts: { email: string; name: string; role: "student" | "teacher" | "superadmin"; password: string }) {
  const id = nanoid();
  const hashed = await hashPassword(opts.password);
  try {
    await db.insert(users).values({
      id,
      name: opts.name,
      email: opts.email,
      emailVerified: true,
      role: opts.role as any,
      kvkkConsentAt: new Date(),
      kvkkConsentVersion: "v1.0",
    } as any);
  } catch (e: any) {
    if (e?.code === "23505") {
      const rows: any = await (db as any).execute(`SELECT id FROM users WHERE email = '${opts.email}' LIMIT 1`);
      const foundId = rows?.rows?.[0]?.id || rows?.[0]?.id;
      if (!foundId) throw e;
      try {
        await db.insert(accounts).values({
          id: nanoid(),
          userId: foundId,
          accountId: foundId,
          providerId: "credential",
          issuer: "local:credential",
          password: hashed,
        } as any);
      } catch {}
      return foundId;
    }
    throw e;
  }
  // better-auth sign-in lookup: providerId='credential' AND issuer='local:credential' AND accountId=userId
  await db.insert(accounts).values({
    id: nanoid(),
    userId: id,
    accountId: id,
    providerId: "credential",
    issuer: "local:credential",
    password: hashed,
  } as any);

  try {
    await db.insert(userCredits).values({ userId: id, balance: opts.role === "student" ? 200 : 0 } as any);
  } catch {}
  try {
    await db.insert(wallets).values({ userId: id } as any);
  } catch {}

  if (opts.role === "teacher") {
    try {
      await db.insert(teacherProfiles).values({
        id: nanoid(),
        userId: id,
        branches: ["Matematik"],
        levels: ["lgs", "yks"],
        isVerified: true,
        verifiedAt: new Date(),
      } as any);
    } catch {}
  }
  if (opts.role === "student") {
    try {
      await db.insert(studentProfiles).values({
        id: nanoid(),
        userId: id,
        level: "lgs" as any,
        grade: 8,
      } as any);
    } catch {}
  }
  return id;
}

async function seed() {
  console.log("Seeding akademi.biz.tr ...");

  const cats = [
    { nameTr: "Matematik", slug: "matematik", level: "lgs" as const, icon: "calculator" },
    { nameTr: "Fen Bilimleri", slug: "fen-bilimleri", level: "lgs" as const, icon: "flask" },
    { nameTr: "Türkçe", slug: "turkce", level: "lgs" as const, icon: "book" },
    { nameTr: "TYT Matematik", slug: "tyt-matematik", level: "yks" as const, icon: "function" },
    { nameTr: "AYT Matematik", slug: "ayt-matematik", level: "yks" as const, icon: "sigma" },
    { nameTr: "Fizik", slug: "fizik", level: "yks" as const, icon: "atom" },
    { nameTr: "Kimya", slug: "kimya", level: "yks" as const, icon: "beaker" },
    { nameTr: "Biyoloji", slug: "biyoloji", level: "yks" as const, icon: "dna" },
  ];
  for (const c of cats) {
    await db.insert(categories).values({ id: nanoid(), nameTr: c.nameTr, slug: c.slug, level: c.level, icon: c.icon } as unknown as any).onConflictDoNothing();
  }

  const pkgs = [
    { nameTr: "Başlangıç", credits: 100, bonus: 0, price: "499.00", featured: false },
    { nameTr: "Popüler", credits: 300, bonus: 50, price: "1299.00", featured: true },
    { nameTr: "Yoğun", credits: 600, bonus: 150, price: "2299.00", featured: false },
    { nameTr: "Aylık", credits: 2000, bonus: 500, price: "3999.00", featured: false },
  ];
  for (const p of pkgs) {
    await db
      .insert(packages)
      .values({
        id: nanoid(),
        nameTr: p.nameTr,
        credits: p.credits,
        bonusCredits: p.bonus,
        priceTry: p.price,
        isFeatured: p.featured,
        validDays: 365,
      } as unknown as any)
      .onConflictDoNothing();
  }

  await db
    .insert(payoutSettings)
    .values({
      id: nanoid(),
      period: "biweekly",
      minAmountTry: 500,
      commissionLive: 20,
      commissionAi: 30,
      autoApproveDays: 7,
    } as unknown as any)
    .onConflictDoNothing();

  console.log("Demo hesaplar oluşturuluyor...");
  await upsertUser({ email: "admin@akademi.biz.tr", name: "Süper Admin", role: "superadmin", password: "Admin123!" });
  await upsertUser({ email: "ogretmen@akademi.biz.tr", name: "Ayşe Hoca", role: "teacher", password: "Ogretmen123!" });
  await upsertUser({ email: "ogrenci@akademi.biz.tr", name: "Deneme Öğrenci", role: "student", password: "Ogrenci123!" });
  await upsertUser({ email: "demo.teacher2@akademi.biz.tr", name: "Mehmet Hoca", role: "teacher", password: "Demo123!" });
  await upsertUser({ email: "demo.student2@akademi.biz.tr", name: "Zeynep Öğrenci", role: "student", password: "Demo123!" });

  console.log("Seed done - demo hesaplar hazır");
  console.log("  admin@akademi.biz.tr / Admin123! (superadmin) -> /superadmin");
  console.log("  ogretmen@akademi.biz.tr / Ogretmen123! (teacher) -> /ogretmen");
  console.log("  ogrenci@akademi.biz.tr / Ogrenci123! (student) -> /ogrenci");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
