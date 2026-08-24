# akademi.biz.tr — AI Öğretmen Klonu + Canlı Ders Platformu

**Domain:** https://akademi.biz.tr  
**Hedef:** LGS & YKS öncelikli, tüm öğrenciler — canlı ders (max 10) + AI klon (ses/tarz/püf noktaları) ile 7/24 özel ders.  
**Deploy:** Cloudflare Tunnel → kendi sunucun → Portainer Stack (GitHub)

## Mimari

- **Web:** Next.js 16 (standalone) + better-auth + next-intl (tr default, en/es hazır) + Tailwind/shadcn
- **Mobile:** Expo 57 (React Native) — kamera (soru çek) + mikrofon (sesli pratik) + LiveKit RN
- **DB:** Postgres 16 + pgvector (1536) + Drizzle ORM + Redis
- **Canlı Ders:** LiveKit SFU (max 10), kayıt, beyaz tahta
- **AI:** OpenRouter gateway (GPU yok) — `gpt-4o-mini` default, `gemini-2.0-flash` cheap, `tts` via `/audio/speech`
- **Storage:** Cloudflare R2 (S3 uyumlu)
- **Ödeme:** Iyzico + PayTR + Stripe + **manuel** (SuperAdmin kredi ekle) — ilk faz manuel, webhook’lar hazır
- **Hakediş:** Cüzdan/ledger, periyot (haftalık/2 hafta/aylık/manuel), min tutar, komisyon (canlı %20, AI %30)

## Hızlı Başlangıç

```bash
cp .env.example .env  # doldur
npm install
npm run db:generate
npm run db:migrate   # veya db:push (dev)
npm run dev          # http://localhost:3000
# mobile
cd mobile && npm install && npm start
```

## Portainer Stack Deploy (senin pattern)

1. GitHub repo oluştur, push et.
2. Portainer → Stacks → Add stack → Repository → `docker-compose.yml` seç.
3. Env’leri Portainer’da tanımla (.env commitlenmez).
4. Cloudflare Tunnel:
   - `cloudflared tunnel create akademi`
   - DNS: `akademi.biz.tr` → tunnel, `livekit.akademi.biz.tr` → livekit:7880
   - Sunucuda `cloudflared` service veya docker’da ayrı container.

`docker-compose.yml` Zencook/Barbers pattern’i ile aynı: `restart: unless-stopped` + healthcheck.

## AI Fiyat/Performans (OpenRouter, 2026-08)

| Model | Girdi/Çıktı $/1M token | Not |
|-------|------------------------|-----|
| `openai/gpt-4o-mini` | 0.15 / 0.60 | **Önerilen** — TR iyi, ucuz |
| `google/gemini-2.0-flash-001` | 0.10 / 0.40 | En ucuz bulk |
| `deepseek/deepseek-chat` | 0.14 / 0.28 | F/P şampiyonu |
| `meta-llama/llama-3.1-8b:free` | 0 / 0 | Fallback |
| TTS `openai/gpt-4o-mini-tts` | ~$0.015/1k karakter | 10dk ~ $0.02 |

Sunucu 24c/144GB, GPU yok → tüm AI OpenRouter üzerinden, self-host yok.

## Roller

- **Öğrenci:** Sınıf bul, kaydol (kredi), canlı derse katıl, AI klonla çalış, ödev
- **Öğretmen:** Sınıf aç (kapasite max 10), canlı ders, AI Klon Stüdyosu (ses/tarz/RAG), kazanç
- **SüperAdmin:** Kullanıcı/ban, sınıf moderasyon, paket/kredi, hakediş periyot/komisyon, AI onay, ödeme sağlayıcı anahtarları

## Güvenlik & KVKK

- Ses klonu: açık rıza checkbox + versiyon logu + SuperAdmin onayı olmadan yayın yok
- RAG guardrail: bilgi tabanı dışına çıkma, “Bunu gerçek öğretmene sor”
- Rate limit, helmet, şifreli ses saklama, moderasyon logu
- Metinler: `/kvkk` — v1.0

## Yol Haritası

- [x] İskelet + DB + Auth + i18n + 3 panel + LiveKit + AI pipeline + Ödeme + Mobile
- [ ] Auth gerçek entegrasyon (better-auth drizzle adapter migration)
- [ ] Paket satın alma akışı + webhook’lar
- [ ] AI chunk upload + embedding job
- [ ] Beyaz tahta (tldraw) + kayıt izleme
- [ ] Push bildirim, sertifika, deneme sınavı

## Notlar

- Dil: TR default, `messages/en.json` ve `es.json` hazır, `next-intl` ile prefix as-needed
- Canlı ders max 10 kişi — `livekit.yaml` ve `src/lib/livekit.ts`’de enforce
- Hakediş periyodu SuperAdmin’den değiştirilebilir (`payout_settings`)
