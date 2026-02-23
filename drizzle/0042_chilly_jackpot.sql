ALTER TYPE "public"."tournament_type" ADD VALUE 'ffa_group_stage';--> statement-breakpoint
CREATE TABLE "event_tournament_group" (
	"id" text PRIMARY KEY NOT NULL,
	"event_tournament_id" text NOT NULL,
	"round" integer NOT NULL,
	"position" integer NOT NULL,
	"advance_count" integer NOT NULL,
	"event_match_id" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_tg_unique" UNIQUE("event_tournament_id","round","position")
);
--> statement-breakpoint
CREATE TABLE "event_tournament_group_participant" (
	"id" text PRIMARY KEY NOT NULL,
	"event_tournament_group_id" text NOT NULL,
	"event_tournament_participant_id" text NOT NULL,
	"rank" integer,
	"score" real,
	"advanced" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_tgp_unique" UNIQUE("event_tournament_group_id","event_tournament_participant_id")
);
--> statement-breakpoint
ALTER TABLE "event_tournament" ADD COLUMN "round_config" text;--> statement-breakpoint
ALTER TABLE "event_tournament_group" ADD CONSTRAINT "event_tournament_group_event_tournament_id_event_tournament_id_fk" FOREIGN KEY ("event_tournament_id") REFERENCES "public"."event_tournament"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tournament_group" ADD CONSTRAINT "event_tournament_group_event_match_id_event_match_id_fk" FOREIGN KEY ("event_match_id") REFERENCES "public"."event_match"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tournament_group_participant" ADD CONSTRAINT "event_tournament_group_participant_event_tournament_group_id_event_tournament_group_id_fk" FOREIGN KEY ("event_tournament_group_id") REFERENCES "public"."event_tournament_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tournament_group_participant" ADD CONSTRAINT "event_tournament_group_participant_event_tournament_participant_id_event_tournament_participant_id_fk" FOREIGN KEY ("event_tournament_participant_id") REFERENCES "public"."event_tournament_participant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_tg_tournament_idx" ON "event_tournament_group" USING btree ("event_tournament_id");--> statement-breakpoint
CREATE INDEX "event_tg_round_idx" ON "event_tournament_group" USING btree ("event_tournament_id","round");--> statement-breakpoint
CREATE INDEX "event_tgp_group_idx" ON "event_tournament_group_participant" USING btree ("event_tournament_group_id");--> statement-breakpoint
CREATE INDEX "event_tgp_participant_idx" ON "event_tournament_group_participant" USING btree ("event_tournament_participant_id");