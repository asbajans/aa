import { NextRequest, NextResponse } from "next/server";
// SuperAdmin manuel kredi ekleme — sadece superadmin çağırabilir

export async function POST(req: NextRequest) {
  const { userId, amount, reason } = await req.json();
  if (!userId || !amount) return NextResponse.json({ error: "userId ve amount gerekli" }, { status: 400 });
  // TODO: session kontrolü -> role === superadmin
  // TODO: db transaction: userCredits.balance += amount, creditTransactions insert (manual_add)
  return NextResponse.json({ ok: true, userId, amount, reason: reason || "manual_add" });
}
