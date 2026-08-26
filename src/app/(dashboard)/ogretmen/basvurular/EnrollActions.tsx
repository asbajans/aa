"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approveEnrollment } from "../actions";

export function EnrollActions({ enrollmentId }: { enrollmentId: string }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const run = (approve: boolean) => {
    setMsg(null);
    start(async () => {
      try {
        await approveEnrollment(enrollmentId, approve);
        setMsg({ type: "ok", text: approve ? "Onaylandı — kredi düşüldü, hakediş yazıldı" : "Reddedildi" });
        router.refresh();
      } catch (e: unknown) {
        setMsg({ type: "err", text: e instanceof Error ? e.message : "Hata oluştu" });
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button size="sm" disabled={pending} onClick={() => run(true)} className="bg-emerald-600 hover:bg-emerald-700">
          {pending ? "..." : "Onayla (kredi düş)"}
        </Button>
        <Button size="sm" variant="outline" disabled={pending} onClick={() => run(false)}>Reddet</Button>
      </div>
      {msg && <div className={`text-xs max-w-[240px] text-right ${msg.type === "ok" ? "text-emerald-600" : "text-red-600"}`}>{msg.text}</div>}
    </div>
  );
}
