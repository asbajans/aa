<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# AGENT.md — akademi.biz.tr | AI Öğretmen Klonu + Canlı Ders Platformu

> **Domain:** `akademi.biz.tr` | **Repo:** `https://github.com/asbajans/aa.git` | **Stack:** Portainer Stack (GitHub) + Cloudflare Tunnel → kendi sunucun (24c/144GB, GPU yok) | **Hedef:** LGS & YKS öncelikli, tüm öğrenciler | **Dil:** TR default, altyapı EN/ES hazır (next-intl)

## 0) Port Haritası (Kural: dış portlar 4000–4200)

| Servis | Container Port | Host Port (dış) | Cloudflare Tunnel Hedefi | Not |
|---|---|---|---|---|
| **web (Next.js)** | `3000` | **`4000:3000`** | `akademi.biz.tr` → `http://web:3000` | ✅ **TUNNEL ile** — tek HTTPS entry |
| **db (pgvector/pg16)** | `5432` | **`4001:5432`** | — (**tunnel YOK**, sadece debug/ssh) | `DATABASE_URL=postgresql://...@db:5432/akademi`. Host’tan `localhost:4001` ile erişim, firewall’da gerekirse kapat |
| **redis** | `6379` | **`4002:6379`** | — (**tunnel YOK**) | `REDIS_URL=redis://redis:6379` |
| **livekit (SFU)** | `7880` (API/WS) | **`4003:7880`** | `livekit.akademi.biz.tr` → `http://livekit:7880` | ✅ **TUNNEL ile** — client `LIVEKIT_URL=wss://livekit.akademi.biz.tr` buraya bağlanır |
| **livekit RTC TCP** | `7881` | **`4004:7881`** | — (**tunnel YOK**, doğrudan firewall) | `livekit.yaml:3` `rtc.tcp_port` — WebRTC TCP fallback |
| **livekit TURN TCP** | `7882` | **`4005:7882/tcp`** | — (**tunnel YOK**) | `livekit.yaml:16` `turn.enabled` açılacaksa |
| **livekit RTC UDP range** | `50000-50194` (195 port) | **`4006-4200:50000-50194/udp`** | — (**tunnel YOK**, doğrudan firewall UDP) | Oda başı max 10, **~195 eşzamanlı katılımcı = ~19 sınıf x 10 kişi** |

**ÖNEMLİ — Tunnel vs Doğrudan Port:**
- **Cloudflare Tunnel (HTTP/WS sadece):** Sadece `web:3000` ve `livekit:7880` tunnel’dan geçer. Yani `cloudflared` config’te **sadece 2 hostname** var — tek tek 195 UDP portu yönlendirmezsin!
- **Doğrudan firewall/NAT (UDP/TCP):** `4004`, `4005`, `4006-4200` **tunnel’dan geçmez**, sunucunun firewall’ında (UFW/iptables) ve varsa router/NAT’ta UDP olarak açık olmalı. LiveKit `use_external_ip: true` ile dış IP’yi client’a bildirir. Tunnel UDP’yi proxy’leyemez.

**Cloudflare Tunnel config örneği (`cloudflared`):**

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /etc/cloudflared/<TUNNEL_ID>.json
ingress:
  - hostname: akademi.biz.tr
    service: http://web:3000        # docker network içinde web:3000, host’ta 4000
  - hostname: livekit.akademi.biz.tr
    service: http://livekit:7880   # host’ta 4003, WSS buradan
  - service: http_status:404
```
# Firewall’da açılması gerekenler (tunnel dışı):
# ufw allow 4004/tcp && ufw allow 4005/tcp && ufw allow 4006:4200/udp

> Tüm dış portlar 4000–4200 aralığında. Portainer’de Stack deploy ederken host’ta bu portların boş olduğu kontrol edilmeli (Zencook 3000, Barbers 3300 ile çakışmaz). `docker-compose.yml:1` tek kaynak.

## 1) Yapılanlar (Done) — commit `ea50767` + port güncellemesi

- [x] **Proje iskeleti:** `create-next-app@16.3.2` (Next.js 16 + Tailwind 4 + TS) → `C:/Users/EXCALIBUR/Documents/Akademi`, `package.json:1`, `next.config.ts:1` (`output: standalone`, `next-intl` plugin), `middleware.ts:1` (locale routing)
- [x] **Docker & Deploy:** `Dockerfile:1` (multi-stage, `standalone` → `server.js`), `docker-compose.yml:1` (web+db+redis+livekit, healthcheck, `akademi-network`, portlar 4000–4200), `livekit/livekit.yaml:1` (max_participants 10, rtc 50000-50194), `.env.example:1`
- [x] **DB:** `src/lib/db/schema.ts:1` (pgvector 1536, `userRoleEnum`, `classes` kapasite 10, `packages/creditTransactions/userCredits/payments`, `wallets/ledgerEntries/payouts/payoutSettings`, `aiClones/aiKnowledgeChunks/aiInteractions`, `assignments/submissions/reviews/notifications`), `drizzle.config.ts:1`, `scripts/init-db.sql:1`, `src/lib/db/seed.ts:1` (LGS/YKS 8 branş + 4 paket + payout ayarları)
- [x] **Auth & i18n:** `src/lib/auth.ts:1` (better-auth + drizzleAdapter, 7 gün session), `src/i18n/routing.ts:1`/`request.ts:1`/`navigation.ts:1`, `messages/tr.json:1` + `en/es` hazır, `middleware.ts:1` `localePrefix: as-needed` (tr prefix yok)
- [x] **Web UI:** `src/app/page.tsx:1` (landing AI klon demosu), `src/app/(auth)/giris|kayit/page.tsx:1`, `src/app/(dashboard)/ogrenci|ogretmen|superadmin/page.tsx:1`, `src/app/(dashboard)/ogretmen/ai-klon/page.tsx:1` (4 adımlı Stüdyo), `src/app/kesfet|paketler|kvkk/page.tsx:1`, `src/app/(dashboard)/canli/page.tsx:1` + `src/components/livekit/LiveRoom.tsx:1` + `src/lib/livekit.ts:1` + `src/app/api/livekit/token/route.ts:1` (AccessToken, `roomAdmin` öğretmene), `src/components/Header.tsx:1`/`Footer.tsx:1`, `src/components/ui/*`
- [x] **AI:** `src/lib/ai/openrouter.ts:1` (OpenRouter gateway, model pricing tablosu, `gpt-4o-mini` default / `gemini-2.0-flash` cheap / `deepseek-chat` F/P, TTS `/audio/speech` `gpt-4o-mini-tts` ~$0.015/1k karakter, STT Whisper placeholder, `buildRagPrompt`), `src/lib/ai/client.ts:1` (embedding → pgvector `<=>` → RAG → fallback model), `src/app/api/ai/chat/route.ts:1`
- [x] **Ödeme & Hakediş:** `src/lib/payments/index.ts:1` (manual + iyzico/paytr/stripe mock, `nextPayoutDate/calcPayout`), `src/app/api/payments/create/route.ts:1` + `src/app/api/credits/add/route.ts:1` (SuperAdmin manuel)
- [x] **Mobile:** `mobile/App.js:1` (Expo 57, `expo-camera`/`expo-av`/`expo-image-picker`/`livekit-client`, izinler `mobile/app.json:1` `tr.biz.akademi`, kamera → vision, ses → STT→TTS, LiveKit RN), `npm install` yapıldı
- [x] **Diğer:** `README.md:1`, `.gitignore:1`, `next build` 19 route success, `git init` + `git remote` (aşağıda)

## 2) Yapılacaklar (TODO) — öncelik sırasıyla

### Faz 0 — Deploy doğrulama (1 gün)
- [ ] `git push -u origin master` → Portainer Stack → `https://github.com/asbajans/aa.git` → `docker-compose.yml` ile deploy testi (healthcheck `/api/health`)
- [ ] Cloudflare Tunnel oluştur (`cloudflared tunnel create akademi`), DNS `akademi.biz.tr` + `livekit.akademi.biz.tr` → yukarıdaki port haritası ile bağla, `TUNNEL_TOKEN` env gir
- [ ] `.env` doldur (`BETTER_AUTH_SECRET` 32+ char, `OPENROUTER_API_KEY`, `LIVEKIT_API_KEY/SECRET`, S3/R2, ödeme anahtarları), `npm run db:push && npm run db:seed` (pgvector extensiyonu `scripts/init-db.sql:1`)

### Faz 1 — MVP LMS (2–3 hafta) — **şu an buradayız**
- [ ] **Auth bağla:** `better-auth` drizzle migration üret (`npm run db:generate`), `src/lib/auth.ts:1`’te `drizzleAdapter` tabloları (`users/sessions/accounts/verifications`) ile sync, `/giris` & `/kayit` formlarını `authClient.signUp/signIn` ile çalıştır, role → dashboard redirect, `layout.tsx` session guard
- [ ] **DB migrate & seed prod:** `drizzle/migrations` Portainer volume’a mount’lı (`docker-compose.yml:54`), ilk deploy’da `init-db.sql` vector extension’ı açar
- [ ] **Sınıf CRUD:** Öğretmen `canli` + `ogretmen` panelinde sınıf oluştur (title, capacity max 10 validation `src/lib/livekit.ts:4`, priceCredits, syllabus), SuperAdmin onay, öğrenci `kesfet` → enroll (kredi düşme `creditTransactions`)
- [ ] **Takvim & Rezervasyon:** `liveSessions` scheduledAt, çakışma kontrolü, hatırlatma (notif)
- [ ] **Paket satın alma akışı:** `paketler` → `POST /api/payments/create` → Iyzico/PayTR/Stripe checkout → webhook `/api/payments/webhook/*` → `payments` success → `creditTransactions` credit + `userCredits` güncelle (şu an mock, gerçek webhook implementasyonu)
- [ ] **LiveKit gerçek test:** 2 cihazla `canli?room=...` → token → bağlanma, ekran paylaşımı, kayıt (egress → R2), yoklama `liveParticipants`

### Faz 2 — AI Klon V1 (2–3 hafta) — **core innovasyon**
- [ ] **AI Stüdyo tam akış:** Ses upload → S3/R2 → ElevenLabs/OpenRouter voice clone (`voiceId` sakla, `aiClones:1` `voiceConsentAt`), RAG doküman upload → chunk → `generateEmbedding` → `aiKnowledgeChunks.embedding`, `systemPrompt` editör, fiyat `pricePerMinute`, `status: pending_review` → SuperAdmin onay
- [ ] **STT gerçek:** `src/lib/ai/openrouter.ts:1` `transcribeAudio` FormData + `POST /audio/transcriptions` implemente (OpenRouter STT yoksa OpenAI fallback)
- [ ] **Vision (mobil):** `mobile/App.js:1` `pickImage` base64 → `/api/ai/chat` → `AI_MODEL_VISION` (`gpt-4o-mini`) ile oku → beyaz tahta (tldraw) entegrasyonu
- [ ] **Kredi & Hakediş entegrasyonu:** `POST /api/ai/chat`’te auth + `userCredits.balance` check → `creditsUsed` debit → `ledgerEntries` earning (pending 7 gün) → `aiInteractions` kaydet → `aiClones.totalInteractions/totalRevenueTry` güncelle

### Faz 3 — Derinleşme (2 hafta)
- [ ] **Beyaz tahta:** `tldraw`/`Excalidraw` embed, LiveKit data channel ile sync, kayıt izleme HLS
- [ ] **Ödev/Sınav & AI değerlendirme:** `assignments/submissions` → açık uçlu → AI (öğretmen tarzıyla) puanla → `gradedBy: ai`
- [ ] **Bildirim & Takvim:** `notifications` + push (Expo `expo-notifications`), email (Resend)
- [ ] **Sertifika & İlerleme:** `enrollments.completedAt` → PDF sertifika
- [ ] **Moderasyon & KVKK:** Ban, şikayet, ses silme talebi, audit log

### Faz 4 — Scale & Polish
- [ ] **Expo build:** `eas build` → iOS/Android store, OTA update
- [ ] **Avatar video (V2):** HeyGen/D-ID, `livekit` egress → video klon
- [ ] **Fine-tune (V2):** LoRA, düşük maliyet için `free` model fine-tune
- [ ] **Load test:** 10 kişi × N oda, OpenRouter rate limit, maliyet dashboard
- [ ] **i18n tam çeviri:** `messages/en.json:1` & `es.json:1` içerikleri TR’den çevir, `next-intl` test

## 3) Kurallar & Notlar (Agent için)

- **Port kuralı:** Dış portlar 4000–4200 arası olmalı. Yeni servis eklenirse sıradaki boş portu kullan (4201+ → kural genişletilmeli). `docker-compose.yml:1` tek kaynak.
- **Dil:** Kod/yorum Türkçe, commit mesajı Türkçe kısa, docs Türkçe. i18n altyapısı hazır ama default `tr`.
- **AI:** Sunucu GPU yok → asla local model önerme, hep OpenRouter (`OPENROUTER_API_KEY`). Fiyat tablosu `src/lib/ai/openrouter.ts:1` `MODEL_PRICING`.
- **Canlı ders:** Max 10 kişi katı kural (`livekit.yaml:8` + `src/lib/livekit.ts:4` + `classes.capacity` default 10).
- **Ödeme:** İlk faz manuel (`POST /api/credits/add` SuperAdmin), otomatik webhook’lar hazır ama sandbox’ta test etmeden prod’a alma.
- **KVKK:** Ses klon için `voiceConsentAt/voiceConsentVersion` + `kvkkConsentAt` zorunlu, SuperAdmin onayı olmadan `aiClones.status != approved` yayın yok (`src/app/(dashboard)/ogretmen/ai-klon/page.tsx:1` uyarı).
- **Deploy:** Portainer Stack → GitHub `asbajans/aa` → `docker-compose.yml`. `.env` asla commitlenmez, Portainer env’de.
- **Next.js:** `output: standalone` korunmalı (`next.config.ts:1`), `Dockerfile:1` buna göre. `middleware.ts:1` `next-intl` routing’i bozma.
- **Mobile:** Expo 57 docs’a göre (`mobile/AGENTS.md:1`), `docs.expo.dev/versions/v57.0.0/` oku. İzin metinleri Türkçe olmalı (`mobile/app.json:1`).
- **Git:** Remote `origin` → `https://github.com/asbajans/aa.git`, branch `master` (ilk commit `ea50767`). Push öncesi `npm run build` success kontrolü.

