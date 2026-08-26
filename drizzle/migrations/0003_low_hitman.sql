CREATE TYPE "public"."one_on_one_status" AS ENUM('pending', 'proposed', 'confirmed', 'completed', 'cancelled', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."teacher_subscription_status" AS ENUM('active', 'cancelled', 'expired');--> statement-breakpoint
CREATE TABLE "one_on_one_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"student_id" text NOT NULL,
	"status" "one_on_one_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"proposed_time" timestamp,
	"duration_minutes" integer DEFAULT 60 NOT NULL,
	"price_credits" integer NOT NULL,
	"student_confirmed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"student_id" text NOT NULL,
	"status" "teacher_subscription_status" DEFAULT 'active' NOT NULL,
	"price_paid" integer NOT NULL,
	"clone_access_used" integer DEFAULT 0 NOT NULL,
	"clone_access_limit" integer NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "uniq_teacher_sub" UNIQUE("teacher_id","student_id")
);
--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "deletion_requested" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "deletion_requested_at" timestamp;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "deletion_reason" text;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD COLUMN "deletion_requested" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "live_sessions" ADD COLUMN "deletion_requested_at" timestamp;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD COLUMN "teacher_subscription_price_credits" integer DEFAULT 199 NOT NULL;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD COLUMN "one_on_one_price_credits" integer DEFAULT 80 NOT NULL;--> statement-breakpoint
ALTER TABLE "teacher_profiles" ADD COLUMN "clone_access_limit" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "one_on_one_requests" ADD CONSTRAINT "one_on_one_requests_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "one_on_one_requests" ADD CONSTRAINT "one_on_one_requests_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_subscriptions" ADD CONSTRAINT "teacher_subscriptions_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_subscriptions" ADD CONSTRAINT "teacher_subscriptions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_1o1_teacher" ON "one_on_one_requests" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "idx_1o1_student" ON "one_on_one_requests" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_1o1_status" ON "one_on_one_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_teacher_sub_teacher" ON "teacher_subscriptions" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "idx_teacher_sub_student" ON "teacher_subscriptions" USING btree ("student_id");