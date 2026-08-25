// Yüksek seviye AI client — chat + RAG + maliyet takibi
import { chatCompletion, generateEmbedding, RECOMMENDED } from "./openrouter";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function ragChat(opts: {
  cloneId: string;
  studentMessage: string;
  teacherStyle: string;
  pitfalls: string[];
  systemPrompt: string;
}) {
  // 1. Embedding oluştur
  const embedding = await generateEmbedding(opts.studentMessage);

  // 2. pgvector ile en yakın 5 chunk'ı bul
  // Not: drizzle vector desteği ham SQL gerektirir
  const chunks = await db.execute(sql`
    SELECT content FROM ai_knowledge_chunks
    WHERE clone_id = ${opts.cloneId}
    ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
    LIMIT 5
  `);

  const contents = (chunks.rows as { content: string }[]).map((r) => r.content as string);

  // 3. System prompt + RAG + kullanıcı mesajı ile LLM çağrısı
  const ragContext = contents.length ? `\nBilgi tabanı:\n${contents.join("\n---\n")}\n` : "";
  const pitfallsText = opts.pitfalls.length ? `Püf noktaları: ${opts.pitfalls.join("; ")}` : "";

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: `${opts.systemPrompt}\nTarz: ${opts.teacherStyle}\n${pitfallsText}${ragContext}\nKurallar: Bilmediğinde uydurma, "Bunu gerçek öğretmenine soralım" de. Sokratik ol, direkt cevap verme, sorularla yönlendir.` },
    { role: "user", content: opts.studentMessage },
  ];

  // Fiyat/performans: önce ucuz model, hata olursa fallback
  try {
    const answer = await chatCompletion({ model: RECOMMENDED.defaultChat, messages, temperature: 0.7 });
    return { answer, model: RECOMMENDED.defaultChat, chunksUsed: contents.length };
  } catch {
    const answer = await chatCompletion({ model: RECOMMENDED.freeFallback, messages, temperature: 0.7 });
    return { answer, model: RECOMMENDED.freeFallback, chunksUsed: contents.length };
  }
}
