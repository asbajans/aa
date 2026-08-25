"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await signOut();
        } finally {
          router.push("/giris");
          router.refresh();
        }
      }}
      className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
    >
      <LogOut size={14} /> Çıkış
    </button>
  );
}
