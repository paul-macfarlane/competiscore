ALTER TYPE "public"."event_point_category" ADD VALUE 'discretionary';--> statement-breakpoint
ALTER TYPE "public"."event_point_outcome" ADD VALUE 'award';--> statement-breakpoint
CREATE TABLE "event_discretionary_award" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"points" real NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_point_entry" ADD COLUMN "event_discretionary_award_id" text;--> statement-breakpoint
ALTER TABLE "event_discretionary_award" ADD CONSTRAINT "event_discretionary_award_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_discretionary_award" ADD CONSTRAINT "event_discretionary_award_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_discretionary_award_event_idx" ON "event_discretionary_award" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_discretionary_award_created_by_idx" ON "event_discretionary_award" USING btree ("created_by_user_id");--> statement-breakpoint
ALTER TABLE "event_point_entry" ADD CONSTRAINT "event_point_entry_event_discretionary_award_id_event_discretionary_award_id_fk" FOREIGN KEY ("event_discretionary_award_id") REFERENCES "public"."event_discretionary_award"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_point_entry_discretionary_idx" ON "event_point_entry" USING btree ("event_discretionary_award_id");