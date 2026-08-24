import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "akademi.biz.tr", ts: new Date().toISOString() });
}
