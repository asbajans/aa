import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";
import { randomBytes, scrypt } from "node:crypto";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { categories, packages, payoutSettings } from "@/lib/db/schema";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// POST /api/admin/bootstrap
// Header: x-bootstrap-key: <BOOTSTRAP_KEY env>
// İlk deploy'da bir kez çağrılır: migration'ları uygular + demo hesapları oluşturur.
// Zaten var olan demo hesapların şifresi demo değere sıfırlanır, rolü düzeltilir.
// Sonraki çağrılar "already bootstrapped" döner (?force=1 ile zorlanabilir).

const DEMO_USERS = [
  { name: "Süper Admin", email: "admin@akademi.biz.tr", password: "Admin123!", role: "superadmin" },
  { name: "Ayşe Hoca", email: "ogretmen@akademi.biz.tr", password: "Ogretmen123!", role: "teacher" },
  { name: "Deneme Öğrenci", email: "ogrenci@akademi.biz.tr", password: "Ogrenci123!", role: "student" },
  { name: "Mehmet Hoca", email: "demo.teacher2@akademi.biz.tr", password: "Demo123!", role: "teacher" },
  { name: "Zeynep Öğrenci", email: "demo.student2@akademi.biz.tr", password: "Demo123!", role: "student" },
];

// better-auth ile aynı scrypt formatı: "salt:key" (hex)
function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, 64, { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 }, (err, key) => {
      if (err) reject(err);
      else resolve(`${salt}:${key.toString("hex")}`);
    });
  });
}

export async function POST(req: Request) {
  const key = req.headers.get("x-bootstrap-key");
  const expected = process.env.BOOTSTRAP_KEY;
  if (!expected) {
    return NextResponse.json({ error: "BOOTSTRAP_KEY env tanımlı değil. Portainer env'e ekleyip redeploy edin." }, { status: 500 });
  }
  if (key !== expected) {
    return NextResponse.json({ error: "Geçersiz x-bootstrap-key" }, { status: 401 });
  }

  const force = new URL(req.url).searchParams.get("force") === "1";
  const result: Record<string, unknown> = { steps: [] };

  try {
    // 0) pgvector extension
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`);
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    (result.steps as string[]).push("extensions: ok");

    // 1) Bootstrap kilidi (force hariç)
    if (!force) {
      const lock = await db.execute(sql`SELECT to_regclass('public.bootstrap_marker') AS t`);
      const exists = (lock.rows as { t: string | null }[])[0]?.t;
      if (exists) {
        return NextResponse.json({ ok: true, message: "Zaten bootstrap yapılmış. Yeniden çalıştırmak için ?force=1 ekleyin." });
      }
    }

    // 2) Migration'ları uygula (drizzle journal takibi ile)
    const migrationsFolder = path.join(process.cwd(), "drizzle", "migrations");
    await migrate(db, { migrationsFolder });
    (result.steps as string[]).push("migrations: ok");

    // 3) Demo kullanıcılar (better-auth signUpEmail — doğru password hash'i)
    const seededUsers: { email: string; role: string; status: string }[] = [];
    for (const u of DEMO_USERS) {
      try {
        await auth.api.signUpEmail({
          body: { name: u.name, email: u.email, password: u.password, role: u.role },
        });
        seededUsers.push({ email: u.email, role: u.role, status: "created" });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/exist|taken/i.test(msg)) {
          // Zaten var: şifreyi demo değere sıfırla + rolü düzelt (demo hesaplar öngörülebilir olmalı)
          const hashed = await hashPassword(u.password);
          const upd = await db.execute(sql`
            UPDATE accounts SET password = ${hashed}, updated_at = now()
            WHERE provider_id = 'credential'
              AND user_id = (SELECT id FROM users WHERE email = ${u.email} LIMIT 1)
          `);
          await db.execute(sql`
            UPDATE users SET role = ${u.role}, name = ${u.name}, email_verified = true, updated_at = now()
            WHERE email = ${u.email}
          `);
          const rowCount = (upd as unknown as { rowCount?: number }).rowCount ?? 0;
          seededUsers.push({ email: u.email, role: u.role, status: rowCount > 0 ? "password-reset" : "account-missing" });
        } else {
          seededUsers.push({ email: u.email, role: u.role, status: `error: ${msg.slice(0, 120)}` });
        }
      }
    }
    result.users = seededUsers;

    // 4) Öğrenci/öğretmen profil + kredi + cüzdan (tüm demo kullanıcılar, idempotent)
    for (const u of seededUsers.filter((x) => x.status !== "account-missing" && !x.status.startsWith("error"))) {
      const row = await db.execute(sql`SELECT id, role FROM users WHERE email = ${u.email} LIMIT 1`);
      const found = (row.rows as { id: string; role: string }[])[0];
      if (!found) continue;
      if (found.role === "student") {
        await db.execute(sql`INSERT INTO student_profiles (id, user_id, level, grade) VALUES (${nanoid()}, ${found.id}, 'lgs', 8) ON CONFLICT (user_id) DO NOTHING`);
        await db.execute(sql`INSERT INTO user_credits (user_id, balance) VALUES (${found.id}, 200) ON CONFLICT (user_id) DO NOTHING`);
      }
      if (found.role === "teacher") {
        await db.execute(sql`INSERT INTO teacher_profiles (id, user_id, branches, levels, is_verified, verified_at) VALUES (${nanoid()}, ${found.id}, '["Matematik"]'::jsonb, '["lgs","yks"]'::jsonb, true, now()) ON CONFLICT (user_id) DO NOTHING`);
      }
      await db.execute(sql`INSERT INTO wallets (user_id) VALUES (${found.id}) ON CONFLICT (user_id) DO NOTHING`);
    }
    (result.steps as string[]).push("profiles/credits/wallets: ok");

    // 5) Kategoriler
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
      await db.insert(categories).values({ id: nanoid(), nameTr: c.nameTr, slug: c.slug, level: c.level, icon: c.icon }).onConflictDoNothing();
    }
    (result.steps as string[]).push("categories: ok");

    // 6) Paketler (sadece boşsa)
    const pkgCount = await db.execute(sql`SELECT count(*)::int AS c FROM packages`);
    if (((pkgCount.rows as { c: number }[])[0]?.c ?? 0) === 0) {
      const pkgs = [
        { nameTr: "Başlangıç", credits: 100, bonus: 0, price: "499.00", featured: false },
        { nameTr: "Popüler", credits: 300, bonus: 50, price: "1299.00", featured: true },
        { nameTr: "Yoğun", credits: 600, bonus: 150, price: "2299.00", featured: false },
        { nameTr: "Aylık", credits: 2000, bonus: 500, price: "3999.00", featured: false },
      ];
      for (const p of pkgs) {
        await db.insert(packages).values({
          id: nanoid(),
          nameTr: p.nameTr,
          credits: p.credits,
          bonusCredits: p.bonus,
          priceTry: p.price,
          isFeatured: p.featured,
          validDays: 365,
        });
      }
    }
    (result.steps as string[]).push("packages: ok");

    // 7) Hakediş ayarları (sadece boşsa)
    const psCount = await db.execute(sql`SELECT count(*)::int AS c FROM payout_settings`);
    if (((psCount.rows as { c: number }[])[0]?.c ?? 0) === 0) {
      await db.insert(payoutSettings).values({
        id: nanoid(),
        period: "biweekly",
        minAmountTry: 500,
        commissionLive: 20,
        commissionAi: 30,
        autoApproveDays: 7,
      });
    }
    (result.steps as string[]).push("payout_settings: ok");

    // 8) Kilidi işaretle
    await db.execute(sql`CREATE TABLE IF NOT EXISTS bootstrap_marker (id text PRIMARY KEY, at timestamp DEFAULT now())`);
    await db.execute(sql`INSERT INTO bootstrap_marker (id) VALUES ('bootstrapped') ON CONFLICT DO NOTHING`);

    result.ok = true;
    result.message = "Bootstrap tamam. Demo hesaplarla giriş yapabilirsin.";
    return NextResponse.json(result);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg, result }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    info: "POST /api/admin/bootstrap — Header: x-bootstrap-key: <BOOTSTRAP_KEY>. İlk deploy'da migration + demo seed çalıştırır.",
  });
}
