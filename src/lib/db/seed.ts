/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "./index";
import { categories, packages, payoutSettings } from "./schema";
import { nanoid } from "nanoid";

async function seed() {
  console.log("Seeding akademi.biz.tr ...");

  // Kategoriler — LGS/YKS
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

  // Paketler
  const pkgs = [
    { nameTr: "Başlangıç", credits: 100, bonus: 0, price: "499.00", featured: false },
    { nameTr: "Popüler", credits: 300, bonus: 50, price: "1299.00", featured: true },
    { nameTr: "Yoğun", credits: 600, bonus: 150, price: "2299.00", featured: false },
    { nameTr: "Sınırsız Aylık", credits: 2000, bonus: 500, price: "3999.00", featured: false },
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

  // Hakediş ayarları
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

  console.log("Seed done");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
