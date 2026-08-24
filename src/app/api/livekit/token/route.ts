import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const { room, identity, name, isTeacher } = await req.json();
    if (!room || !identity) return NextResponse.json({ error: "room ve identity gerekli" }, { status: 400 });

    const apiKey = process.env.LIVEKIT_API_KEY || "devkey";
    const apiSecret = process.env.LIVEKIT_API_SECRET || "secret";

    const at = new AccessToken(apiKey, apiSecret, { identity, name: name || identity, ttl: "2h" });
    at.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    // Öğretmen için ek yetkiler (kayıt başlatma, katılımcı atma)
    if (isTeacher) {
      at.addGrant({ roomAdmin: true });
    }

    const token = await at.toJwt();
    return NextResponse.json({ token, url: process.env.LIVEKIT_URL || "ws://localhost:7880" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
