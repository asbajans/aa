"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

interface Slot {
  day: number;
  start: string;
  end: string;
}

export function ScheduleEditor({ initial, action }: { initial: Slot[]; action: (fd: FormData) => Promise<void> }) {
  const [slots, setSlots] = useState<Slot[]>(initial.length ? initial : []);
  const [saving, setSaving] = useState(false);

  const addSlot = () => setSlots((s) => [...s, { day: 0, start: "18:00", end: "21:00" }]);
  const removeSlot = (i: number) => setSlots((s) => s.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof Slot, value: string | number) => setSlots((s) => s.map((x, idx) => (idx === i ? { ...x, [field]: value } : x)));

  return (
    <form
      action={async (fd: FormData) => {
        setSaving(true);
        const cleaned = slots.filter((s) => s.start && s.end);
        fd.set("weeklySchedule", JSON.stringify(cleaned));
        await action(fd);
        setSaving(false);
      }}
      className="space-y-3"
    >
      <input type="hidden" name="weeklySchedule" value={JSON.stringify(slots.filter((s) => s.start && s.end))} />
      <div className="space-y-2">
        {slots.map((s, i) => (
          <div key={i} className="grid grid-cols-[130px_1fr_1fr_40px] gap-2 items-center">
            <select value={s.day} onChange={(e) => update(i, "day", Number(e.target.value))} className="rounded-xl border border-zinc-200 bg-white px-2 py-2 text-sm text-zinc-900">
              {DAYS.map((d, di) => <option key={d} value={di}>{d}</option>)}
            </select>
            <input type="time" value={s.start} onChange={(e) => update(i, "start", e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <input type="time" value={s.end} onChange={(e) => update(i, "end", e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900" />
            <button type="button" onClick={() => removeSlot(i)} className="h-9 w-9 grid place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50" aria-label="Sil">×</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={addSlot}>+ Slot Ekle</Button>
        <Button type="submit" disabled={saving}>{saving ? "Kaydediliyor..." : "Programı Kaydet"}</Button>
      </div>
      <div className="text-xs text-zinc-400">Örn: Pazartesi 18:00-21:00. Öğrenciler profilinde bu müsaitlikleri görür.</div>
    </form>
  );
}
