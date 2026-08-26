ALTER TABLE "enrollments" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "enrollments" ADD COLUMN "request_message" text;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD COLUMN "hourly_price_credits" integer DEFAULT 60 NOT NULL;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD COLUMN "enrollment_fee_credits" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD COLUMN "weekly_schedule" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD COLUMN "bio_detail" text;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD COLUMN "experience_years" integer DEFAULT 0 NOT NULL;