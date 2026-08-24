import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/payments";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: auth, paket doğrula
  const result = await createPayment(body);
  // TODO: payments tablosuna kaydet, creditTransactions pending
  return NextResponse.json(result);
}
