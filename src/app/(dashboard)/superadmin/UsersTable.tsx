"use client";
import { useState, useTransition } from "react";
import { Ban, CheckCircle, Coins } from "lucide-react";
import { toggleBan, setRole, addCredits } from "./actions";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  credits: number;
  createdAt: string;
}

export function UsersTable({ users: initialUsers }: { users: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [pending, startTransition] = useTransition();
  const [creditAmount, setCreditAmount] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<string | null>(null);

  const onToggleBan = (u: AdminUser) => {
    startTransition(async () => {
      await toggleBan(u.id, !u.isBanned);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isBanned: !x.isBanned } : x)));
      setMsg(`${u.name} ${!u.isBanned ? "banlandı" : "banı kaldırıldı"}`);
    });
  };

  const onSetRole = (u: AdminUser, role: string) => {
    startTransition(async () => {
      await setRole(u.id, role as "student" | "teacher" | "superadmin");
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
      setMsg(`${u.name} → ${role}`);
    });
  };

  const onAddCredits = (u: AdminUser) => {
    const amount = parseInt(creditAmount[u.id] || "0", 10);
    if (!amount || amount <= 0) {
      setMsg("Geçerli bir kredi miktarı gir");
      return;
    }
    startTransition(async () => {
      const res = await addCredits(u.id, amount);
      if (res.ok) {
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, credits: (x.credits || 0) + amount } : x)));
        setCreditAmount((prev) => ({ ...prev, [u.id]: "" }));
        setMsg(`${u.name} +${amount} kredi (yeni bakiye: ${res.balanceAfter})`);
      } else {
        setMsg(res.error || "Hata");
      }
    });
  };

  return (
    <div className="space-y-3">
      {msg && <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">{msg}</div>}
      {pending && <div className="text-xs text-zinc-400">İşleniyor...</div>}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Kullanıcı</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Kredi</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((u) => (
              <tr key={u.id} className={u.isBanned ? "opacity-50" : ""}>
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900">{u.name}</div>
                  <div className="text-xs text-zinc-500">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => onSetRole(u, e.target.value)}
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                    disabled={pending}
                  >
                    <option value="student">student</option>
                    <option value="teacher">teacher</option>
                    <option value="superadmin">superadmin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Coins size={13} className="text-amber-500" />
                    <span className="font-semibold">{u.credits ?? 0}</span>
                  </div>
                  <div className="mt-1 flex gap-1">
                    <input
                      type="number"
                      placeholder="100"
                      value={creditAmount[u.id] || ""}
                      onChange={(e) => setCreditAmount((prev) => ({ ...prev, [u.id]: e.target.value }))}
                      className="w-16 rounded-lg border border-zinc-200 px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => onAddCredits(u)}
                      disabled={pending}
                      className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Ekle
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {u.isBanned ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-medium text-red-700">
                      <Ban size={11} /> Banlı
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <CheckCircle size={11} /> Aktif
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onToggleBan(u)}
                    disabled={pending}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 ${u.isBanned ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
                  >
                    {u.isBanned ? "Banı Kaldır" : "Banla"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                  Kullanıcı yok — <code className="rounded bg-zinc-100 px-1">npm run db:seed</code> ile demo hesapları oluştur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
