import { NextRequest, NextResponse } from "next/server";
import { ragChat } from "@/lib/ai/client";
import { synthesizeSpeech } from "@/lib/ai/openrouter";

export async function POST(req: NextRequest) {
  try {
    const { cloneId, message, wantAudio, teacherStyle, systemPrompt, pitfalls } = await req.json();
    if (!cloneId || !message) return NextResponse.json({ error: "cloneId ve message gerekli" }, { status: 400 });

    // TODO: auth + kredi kontrolü (userCredits.balance >= cost)
    // TODO: picks: clone'u db'den çek, teacherStyle/systemPrompt oradan gelsin

    const result = await ragChat({
      cloneId,
      studentMessage: message,
      teacherStyle: teacherStyle || "sokratik, arkadaş canlısı",
      pitfalls: pitfalls || [],
      systemPrompt: systemPrompt || "Sen bir LGS/YKS öğretmeninin AI klonusun.",
    });

    let audioBase64: string | null = null;
    if (wantAudio) {
      try {
        const buf = await synthesizeSpeech({ text: result.answer.slice(0, 4000) }); // TTS limiti
        audioBase64 = buf.toString("base64");
      } catch (e) {
        console.error("TTS hatası", e);
      }
    }

    // TODO: creditTransactions'e debit yaz, ledger'e earning ekle, ai_interactions kaydet

    return NextResponse.json({
      answer: result.answer,
      model: result.model,
      chunksUsed: result.chunksUsed,
      audioBase64, // data:audio/mp3;base64, ile çalınır
      creditsUsed: 2, // örnek: 2 kredi
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
