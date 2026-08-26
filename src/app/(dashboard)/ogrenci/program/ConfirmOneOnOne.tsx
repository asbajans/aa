"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { confirmOneOnOne } from "@/app/ogretmenler/[id]/actions";

export function ConfirmOneOnOne({ requestId, price }: { requestId: string; price: number }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const run = () => {
    setMsg(null);
    start(async () => {
      try {
        const fd = new FormData();
        fd.set("id", requestId);
        await confirmOneOnOne(fd);
        setMsg({ type: "ok", text: "Onaylandı — kredi düşüldü, ders odası açıldı" });
        router.refresh();
      } catch (e: unknown) {
        setMsg({ type: "err", text: e instanceof Error ? e.message : "Hata oluştu" });
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" disabled={pending} onClick={run} className="bg-emerald-600 hover:bg-emerald-700">
        {pending ? "..." : `Onayla ve Öde — ${price} kredi`}
      </Button>
      {msg && <div className={`text-xs max-w-[240px] text-right ${msg.type === "ok" ? "text-emerald-600" : "text-red-600"}`}>{msg.text}</div>}
    </div>
  );
}
