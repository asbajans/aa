// OpenRouter — fiyat/performans model seçimi (GPU yok sunucuda)
// Docs: https://openrouter.ai/docs
// Speech: https://openrouter.ai/docs/guides/overview/multimodal/tts -> POST /api/v1/audio/speech
// Chat: https://openrouter.ai/api/v1/chat/completions (OpenAI uyumlu)

const BASE = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

type ChatModel =
  | "openai/gpt-4o-mini" // ucuz, hızlı, TR iyi
  | "google/gemini-2.0-flash-001" // çok ucuz, hızlı, TR orta-iyi
  | "meta-llama/llama-3.1-8b-instruct:free" // ücretsiz yedek
  | "anthropic/claude-3.5-haiku" // pahalı ama kaliteli yedek
  | string;

export const MODEL_PRICING: Record<string, { in: number; out: number; note: string }> = {
  "openai/gpt-4o-mini": { in: 0.15, out: 0.6, note: "Önerilen default — TR kaliteli, ucuz" },
  "google/gemini-2.0-flash-001": { in: 0.1, out: 0.4, note: "En ucuz hızlı — bulk işler için" },
  "meta-llama/llama-3.1-8b-instruct:free": { in: 0, out: 0, note: "Ücretsiz fallback — rate limit var" },
  "qwen/qwen-2.5-7b-instruct": { in: 0.05, out: 0.2, note: "Çin modeli — çok ucuz, TR zayıf" },
  "deepseek/deepseek-chat": { in: 0.14, out: 0.28, note: "Fiyat/performans şampiyonu 2026" },
  "openai/gpt-4o": { in: 2.5, out: 10, note: "Pahalı — sadece kritik yerlerde" },
};

// Fiyat/performans: TR için öneri tablosu (2026-08 verisi)
export const RECOMMENDED = {
  defaultChat: "openai/gpt-4o-mini", // ana sohbet
  cheapBulk: "google/gemini-2.0-flash-001", // ödev değerlendirme, toplu iş
  freeFallback: "meta-llama/llama-3.1-8b-instruct:free",
  vision: "openai/gpt-4o-mini", // fotoğraftan soru okuma — vision destekli
  embedding: "openai/text-embedding-3-small", // RAG
  // TTS (OpenRouter üzerinden)
  tts: "openai/gpt-4o-mini-tts", // OpenRouter TTS endpoint'inde model
  ttsFallback: "openai/tts-1",
} as const;

export async function chatCompletion(opts: {
  model?: ChatModel;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  temperature?: number;
  max_tokens?: number;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY eksik");

  const model = opts.model || process.env.AI_MODEL_CHAT || RECOMMENDED.defaultChat;

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://akademi.biz.tr",
      "X-Title": "akademi.biz.tr AI Clone",
    },
    body: JSON.stringify({
      model,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.max_tokens ?? 1024,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenRouter chat failed ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content as string;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY eksik");
  const res = await fetch(`${BASE}/embeddings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "openai/text-embedding-3-small", input: text }),
  });
  if (!res.ok) throw new Error(`Embedding failed ${res.status}`);
  const data = await res.json();
  return data.data[0].embedding;
}

// TTS — OpenRouter /audio/speech (OpenAI uyumlu)
// Fiyat: karakter başı ~$0.015/1k karakter (model'e göre değişir). 10dk ses ~ 1500 karakter ~ $0.02
export async function synthesizeSpeech(opts: { text: string; voice?: string; model?: string; format?: string }): Promise<Buffer> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY eksik");
  const model = opts.model || process.env.TTS_MODEL || RECOMMENDED.tts;
  const voice = opts.voice || process.env.TTS_VOICE || "alloy"; // alloy, echo, fable vb.

  const res = await fetch(`${BASE}/audio/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: opts.text,
      voice,
      response_format: opts.format || "mp3",
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`TTS failed ${res.status}: ${txt}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

// STT — OpenRouter üzerinden Whisper (veya OpenAI direkt)
export async function transcribeAudio(audioBuffer: Buffer, filename = "audio.webm"): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  // OpenRouter STT endpoint yoksa OpenAI fallback kullanılabilir — şimdilik mock
  // Gerçek entegrasyonda: fetch(`${BASE}/audio/transcriptions`, { formData ... })
  if (!apiKey) throw new Error("OPENROUTER_API_KEY eksik");
  // TODO: implement with fetch + FormData when OpenRouter STT is confirmed
  return "[STT placeholder] Transcribe edilecek ses uzunluğu: " + audioBuffer.length;
}

// RAG helper: ilgili chunkları bul (pgvector cosine)
export function buildRagPrompt(chunks: string[], teacherStyle: string, pitfalls: string[]) {
  return `Sen bir öğretmenin AI klonusun. Tarzın: ${teacherStyle}
Püf noktaların: ${pitfalls.join("; ")}
Aşağıdaki bilgi tabanını kullan, dışına çıkma, bilmiyorsan "Bunu gerçek öğretmenine soralım" de.
Bilgi:
${chunks.join("\n---\n")}`;
}
