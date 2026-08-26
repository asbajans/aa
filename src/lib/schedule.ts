// Ders periyodu yardımcıları — gün indeksleri: 0=Pazartesi .. 6=Pazar
export const DAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
export const DAY_LONG = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

export interface ScheduleLike {
  scheduleType?: string | null;
  scheduleDays?: number[] | null;
  scheduleMonthDays?: number[] | null;
  scheduleTime?: string | null;
}

export function scheduleLabel(cls: ScheduleLike): string {
  if (!cls.scheduleType || cls.scheduleType === "none") return "Esnek program";
  const time = cls.scheduleTime ? ` • ${cls.scheduleTime}` : "";
  if (cls.scheduleType === "weekly") {
    const days = (cls.scheduleDays || []).slice().sort().map((d) => DAY_SHORT[d] ?? "").filter(Boolean);
    return days.length ? `Haftalık: ${days.join(", ")}${time}` : "Haftalık (gün seçilmemiş)";
  }
  if (cls.scheduleType === "monthly") {
    const days = (cls.scheduleMonthDays || []).slice().sort((a, b) => a - b);
    return days.length ? `Aylık: her ayın ${days.join(", ")}. günü${time}` : "Aylık (gün seçilmemiş)";
  }
  return "Esnek program";
}

// Sonraki N tarih üret (canlı ders otomatik planlama)
export function generateNextDates(scheduleType: string, days: number[], monthDays: number[], time: string, count: number): Date[] {
  const [h, m] = (time || "18:00").split(":").map((x) => parseInt(x, 10));
  const hour = isNaN(h) ? 18 : h;
  const minute = isNaN(m) ? 0 : m;
  const now = new Date();

  if (scheduleType === "weekly" && days.length) {
    const todayOur = (now.getDay() + 6) % 7; // 0=Pzt
    const candidates: Date[] = [];
    for (const d of days) {
      const diff = (d - todayOur + 7) % 7;
      const date = new Date(now);
      date.setDate(now.getDate() + diff);
      date.setHours(hour, minute, 0, 0);
      if (date <= now) date.setDate(date.getDate() + 7);
      candidates.push(new Date(date));
      const next = new Date(date);
      next.setDate(next.getDate() + 7);
      candidates.push(next);
    }
    candidates.sort((a, b) => a.getTime() - b.getTime());
    return candidates.slice(0, count);
  }

  if (scheduleType === "monthly" && monthDays.length) {
    const candidates: Date[] = [];
    for (const day of monthDays) {
      for (let mo = 0; mo < 2; mo++) {
        const date = new Date(now.getFullYear(), now.getMonth() + mo, day, hour, minute, 0, 0);
        if (date.getDate() === day && date > now) candidates.push(new Date(date));
      }
    }
    candidates.sort((a, b) => a.getTime() - b.getTime());
    return candidates.slice(0, count);
  }

  return [];
}
