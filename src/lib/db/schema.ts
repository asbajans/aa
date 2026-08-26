import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  index,
  unique,
  jsonb,
  numeric,
  vector,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============ ENUMS ============
export const userRoleEnum = pgEnum("user_role", ["student", "teacher", "superadmin"]);
export const classLevelEnum = pgEnum("class_level", ["lgs", "yks", "other"]);
export const classStatusEnum = pgEnum("class_status", ["draft", "published", "archived"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["pending", "active", "cancelled", "completed"]);
export const liveSessionStatusEnum = pgEnum("live_session_status", ["scheduled", "live", "ended", "cancelled"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["credit", "debit"]);
export const transactionReasonEnum = pgEnum("transaction_reason", [
  "purchase",
  "manual_add",
  "live_lesson",
  "ai_clone_chat",
  "ai_clone_voice",
  "assignment_review",
  "refund",
  "bonus",
  "payout",
]);
export const payoutStatusEnum = pgEnum("payout_status", ["pending", "approved", "paid", "rejected"]);
export const payoutPeriodEnum = pgEnum("payout_period", ["weekly", "biweekly", "monthly", "manual"]);
export const aiCloneStatusEnum = pgEnum("ai_clone_status", ["draft", "pending_review", "approved", "rejected", "disabled"]);
export const paymentProviderEnum = pgEnum("payment_provider", ["manual", "iyzico", "paytr", "stripe"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "success", "failed", "cancelled"]);

// ============ USERS (better-auth uyumlu) ============
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: userRoleEnum("role").default("student").notNull(),
    // Ortak
    phone: varchar("phone", { length: 20 }),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    // KVKK
    kvkkConsentAt: timestamp("kvkk_consent_at"),
    kvkkConsentVersion: varchar("kvkk_consent_version", { length: 20 }),
    isBanned: boolean("is_banned").default(false).notNull(),
    bannedReason: text("banned_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_users_role").on(t.role), index("idx_users_email").on(t.email)]
);

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  // better-auth zorunlu alan — credential için "local:credential"
  issuer: text("issuer").notNull().default("local:credential"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  expiresAt: timestamp("expires_at"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============ TEACHER PROFILES ============
export const teacherProfiles = pgTable("teacher_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  branches: jsonb("branches").$type<string[]>().default([]), // ["Matematik", "Fen"]
  levels: jsonb("levels").$type<string[]>().default(["lgs", "yks"]),
  diplomaUrl: text("diploma_url"),
  isVerified: boolean("is_verified").default(false).notNull(),
  verifiedAt: timestamp("verified_at"),
  // SaaS: Fiyatlandırma (öğretmen kendi belirler)
  hourlyPriceCredits: integer("hourly_price_credits").default(60).notNull(), // 1 saat canlı ders = 60 kredi
  enrollmentFeeCredits: integer("enrollment_fee_credits").default(0).notNull(), // öğrencinin öğretmene kaydolma ücreti (0 = ücretsiz başvuru)
  // SaaS: Haftalık program (öğretmen müsaitlik)
  weeklySchedule: jsonb("weekly_schedule").$type<{ day: number; start: string; end: string; }[]>().default([]),
  bioDetail: text("bio_detail"),
  experienceYears: integer("experience_years").default(0).notNull(),
  // Hakediş oranları
  commissionRateLive: integer("commission_rate_live").default(20).notNull(), // platform %20
  commissionRateAi: integer("commission_rate_ai").default(30).notNull(), // platform %30 AI'da daha yüksek (API maliyeti)
  // AI
  aiEnabled: boolean("ai_enabled").default(false).notNull(),
  voiceId: text("voice_id"), // ElevenLabs/OpenRouter voice id
  // Ödeme
  iban: varchar("iban", { length: 34 }),
  ibanHolderName: text("iban_holder_name"),
  payoutPeriod: payoutPeriodEnum("payout_period").default("biweekly").notNull(),
  payoutMinAmount: integer("payout_min_amount").default(500).notNull(), // TRY
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============ STUDENT PROFILES ============
export const studentProfiles = pgTable("student_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  level: classLevelEnum("level").default("lgs").notNull(),
  grade: integer("grade"), // 7,8,11,12
  parentId: text("parent_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============ CATEGORIES (Branşlar) ============
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  nameTr: varchar("name_tr", { length: 100 }).notNull(),
  nameEn: varchar("name_en", { length: 100 }),
  nameEs: varchar("name_es", { length: 100 }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  level: classLevelEnum("level").notNull(), // lgs/yks/other
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ CLASSES (Sınıflar) ============
export const classes = pgTable(
  "classes",
  {
    id: text("id").primaryKey(),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    title: varchar("title", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    description: text("description"),
    level: classLevelEnum("level").notNull(),
    capacity: integer("capacity").default(10).notNull(), // max 10
    priceCredits: integer("price_credits").notNull(), // kredi cinsinden
    priceTry: numeric("price_try", { precision: 10, scale: 2 }), // vitrin fiyatı
    coverImageUrl: text("cover_image_url"),
    syllabus: jsonb("syllabus").$type<{ week: number; topic: string }[]>(),
    status: classStatusEnum("status").default("draft").notNull(),
    isAiCloneAllowed: boolean("is_ai_clone_allowed").default(true).notNull(),
    ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 }).default("0"),
    ratingCount: integer("rating_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_classes_teacher").on(t.teacherId), index("idx_classes_category").on(t.categoryId), index("idx_classes_level").on(t.level)]
);

// ============ ENROLLMENTS ============
export const enrollments = pgTable(
  "enrollments",
  {
    id: text("id").primaryKey(),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: enrollmentStatusEnum("status").default("pending").notNull(),
    creditsPaid: integer("credits_paid").notNull(),
    requestMessage: text("request_message"),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (t) => [unique("uniq_enrollment").on(t.classId, t.studentId)]
);

// ============ LIVE SESSIONS ============
export const liveSessions = pgTable(
  "live_sessions",
  {
    id: text("id").primaryKey(),
    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => users.id),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    livekitRoom: varchar("livekit_room", { length: 100 }).notNull().unique(),
    scheduledAt: timestamp("scheduled_at").notNull(),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    status: liveSessionStatusEnum("status").default("scheduled").notNull(),
    recordingUrl: text("recording_url"),
    recordingDuration: integer("recording_duration"), // saniye
    maxParticipants: integer("max_participants").default(10).notNull(),
    whiteboardData: jsonb("whiteboard_data"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("idx_live_class").on(t.classId), index("idx_live_scheduled").on(t.scheduledAt)]
);

export const liveParticipants = pgTable("live_participants", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => liveSessions.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  leftAt: timestamp("left_at"),
  durationSeconds: integer("duration_seconds").default(0).notNull(),
  isPresent: boolean("is_present").default(false).notNull(),
});

// ============ PACKAGES & CREDITS ============
export const packages = pgTable("packages", {
  id: text("id").primaryKey(),
  nameTr: varchar("name_tr", { length: 100 }).notNull(),
  nameEn: varchar("name_en", { length: 100 }),
  nameEs: varchar("name_es", { length: 100 }),
  credits: integer("credits").notNull(),
  bonusCredits: integer("bonus_credits").default(0).notNull(),
  priceTry: numeric("price_try", { precision: 10, scale: 2 }).notNull(),
  priceUsd: numeric("price_usd", { precision: 10, scale: 2 }),
  validDays: integer("valid_days").default(365).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  // Ödeme sağlayıcı ürün ID'leri
  iyzicoProductId: text("iyzico_product_id"),
  paytrProductId: text("paytr_product_id"),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: transactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(), // pozitif: kredi, negatif mantığı type ile
    balanceAfter: integer("balance_after").notNull(),
    reason: transactionReasonEnum("reason").notNull(),
    refId: text("ref_id"), // classId, sessionId, aiInteractionId
    provider: paymentProviderEnum("provider").default("manual"),
    paymentId: text("payment_id").references(() => payments.id),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("idx_credit_user").on(t.userId), index("idx_credit_created").on(t.createdAt)]
);

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  packageId: text("package_id").references(() => packages.id),
  provider: paymentProviderEnum("provider").notNull(),
  providerPaymentId: text("provider_payment_id"),
  amountTry: numeric("amount_try", { precision: 10, scale: 2 }).notNull(),
  credits: integer("credits").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  rawResponse: jsonb("raw_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Kullanıcı kredi bakiyesi (materialized view yerine tablo, transaction ile güncellenir)
export const userCredits = pgTable("user_credits", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  balance: integer("balance").default(0).notNull(),
  totalEarned: integer("total_earned").default(0).notNull(),
  totalSpent: integer("total_spent").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============ WALLETS & PAYOUTS (Hakediş) ============
export const wallets = pgTable("wallets", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  balanceTry: numeric("balance_try", { precision: 12, scale: 2 }).default("0").notNull(), // ödenebilir bakiye
  pendingTry: numeric("pending_try", { precision: 12, scale: 2 }).default("0").notNull(), // bekleyen (iade süresi)
  totalEarnedTry: numeric("total_earned_try", { precision: 12, scale: 2 }).default("0").notNull(),
  totalPaidTry: numeric("total_paid_try", { precision: 12, scale: 2 }).default("0").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ledgerEntries = pgTable(
  "ledger_entries",
  {
    id: text("id").primaryKey(),
    walletUserId: text("wallet_user_id")
      .notNull()
      .references(() => wallets.userId, { onDelete: "cascade" }),
    amountTry: numeric("amount_try", { precision: 10, scale: 2 }).notNull(),
    type: varchar("type", { length: 20 }).notNull(), // earning, payout, refund, fee
    source: varchar("source", { length: 20 }).notNull(), // live, ai, manual
    sourceId: text("source_id"), // sessionId / aiInteractionId
    description: text("description"),
    status: varchar("status", { length: 20 }).default("pending").notNull(), // pending (iade süresi), approved, paid
    availableAt: timestamp("available_at"), // iade süresi dolunca approved olur
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("idx_ledger_wallet").on(t.walletUserId)]
);

export const payouts = pgTable("payouts", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id")
    .notNull()
    .references(() => users.id),
  amountTry: numeric("amount_try", { precision: 10, scale: 2 }).notNull(),
  iban: varchar("iban", { length: 34 }).notNull(),
  holderName: text("holder_name").notNull(),
  status: payoutStatusEnum("status").default("pending").notNull(),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  processedBy: text("processed_by").references(() => users.id),
  receiptUrl: text("receipt_url"),
  note: text("note"),
});

export const payoutSettings = pgTable("payout_settings", {
  id: text("id").primaryKey(),
  period: payoutPeriodEnum("period").default("biweekly").notNull(),
  minAmountTry: integer("min_amount_try").default(500).notNull(),
  commissionLive: integer("commission_live").default(20).notNull(),
  commissionAi: integer("commission_ai").default(30).notNull(),
  autoApproveDays: integer("auto_approve_days").default(7).notNull(), // iade süresi
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  updatedBy: text("updated_by").references(() => users.id),
});

// ============ AI CLONE ============
export const aiClones = pgTable("ai_clones", {
  id: text("id").primaryKey(),
  teacherId: text("teacher_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  voiceId: text("voice_id"), // TTS voice id
  voiceProvider: varchar("voice_provider", { length: 20 }).default("openrouter"), // openrouter/elevenlabs/camb
  voiceSampleUrl: text("voice_sample_url"),
  voiceConsentAt: timestamp("voice_consent_at"),
  voiceConsentVersion: varchar("voice_consent_version", { length: 20 }),
  systemPrompt: text("system_prompt").notNull(), // "Sen Ayşe Hoca'sın, tarzın..."
  teachingStyle: jsonb("teaching_style").$type<{
    tone: string; // "sokratik" | "otoriter" | "arkadas"
    examples: string[];
    pitfalls: string[]; // püf noktaları
  }>(),
  subjects: jsonb("subjects").$type<string[]>().default([]),
  pricePerMinute: integer("price_per_minute").default(2).notNull(), // kredi/dk
  status: aiCloneStatusEnum("status").default("draft").notNull(),
  rejectionReason: text("rejection_reason"),
  totalInteractions: integer("total_interactions").default(0).notNull(),
  totalRevenueTry: numeric("total_revenue_try", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiKnowledgeChunks = pgTable(
  "ai_knowledge_chunks",
  {
    id: text("id").primaryKey(),
    cloneId: text("clone_id")
      .notNull()
      .references(() => aiClones.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    sourceType: varchar("source_type", { length: 20 }).notNull(), // pdf, video_transcript, note, pitfalls
    sourceUrl: text("source_url"),
    // pgvector - 1536 boyut (text-embedding-3-small)
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("idx_knowledge_clone").on(t.cloneId)]
);

export const aiInteractions = pgTable(
  "ai_interactions",
  {
    id: text("id").primaryKey(),
    cloneId: text("clone_id")
      .notNull()
      .references(() => aiClones.id),
    studentId: text("student_id")
      .notNull()
      .references(() => users.id),
    // Mesajlaşma
    messages: jsonb("messages").$type<{ role: "user" | "assistant"; content: string; audioUrl?: string }[]>().default([]),
    creditsUsed: integer("credits_used").default(0).notNull(),
    durationSeconds: integer("duration_seconds").default(0).notNull(),
    // Değerlendirme
    rating: integer("rating"), // 1-5
    feedback: text("feedback"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_ai_inter_clone").on(t.cloneId), index("idx_ai_inter_student").on(t.studentId)]
);

// ============ CONTENT & ASSIGNMENTS ============
export const assignments = pgTable("assignments", {
  id: text("id").primaryKey(),
  classId: text("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  teacherId: text("teacher_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).notNull(), // homework, quiz, exam
  questions: jsonb("questions").$type<{ q: string; options?: string[]; answer?: string; points: number }[]>(),
  dueAt: timestamp("due_at"),
  maxPoints: integer("max_points").default(100).notNull(),
  isAiGraded: boolean("is_ai_graded").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: text("id").primaryKey(),
  assignmentId: text("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id),
  answers: jsonb("answers"),
  attachments: jsonb("attachments").$type<string[]>(),
  score: integer("score"),
  feedback: text("feedback"),
  gradedAt: timestamp("graded_at"),
  gradedBy: varchar("graded_by", { length: 20 }), // teacher, ai
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  classId: text("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "cascade" }),
  studentId: text("student_id")
    .notNull()
    .references(() => users.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body"),
  type: varchar("type", { length: 30 }).notNull(), // enrollment, live_reminder, payout, ai
  link: text("link"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ RELATIONS ============
export const usersRelations = relations(users, ({ one, many }) => ({
  teacherProfile: one(teacherProfiles, { fields: [users.id], references: [teacherProfiles.userId] }),
  studentProfile: one(studentProfiles, { fields: [users.id], references: [studentProfiles.userId] }),
  classes: many(classes),
  enrollments: many(enrollments),
  wallet: one(wallets, { fields: [users.id], references: [wallets.userId] }),
  credits: one(userCredits, { fields: [users.id], references: [userCredits.userId] }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, { fields: [classes.teacherId], references: [users.id] }),
  category: one(categories, { fields: [classes.categoryId], references: [categories.id] }),
  enrollments: many(enrollments),
  liveSessions: many(liveSessions),
}));

export const aiClonesRelations = relations(aiClones, ({ one, many }) => ({
  teacher: one(users, { fields: [aiClones.teacherId], references: [users.id] }),
  chunks: many(aiKnowledgeChunks),
  interactions: many(aiInteractions),
}));
