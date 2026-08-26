ALTER TABLE "classes" ADD COLUMN "schedule_type" varchar(10) DEFAULT 'weekly' NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "schedule_days" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "schedule_month_days" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "schedule_time" varchar(5) DEFAULT '18:00' NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "duration_minutes" integer DEFAULT 60 NOT NULL;