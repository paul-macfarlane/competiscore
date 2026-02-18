ALTER TABLE "event_match" ADD COLUMN "event_tournament_round_match_id" text;--> statement-breakpoint
ALTER TABLE "event_tournament" ADD COLUMN "round_best_of" text;--> statement-breakpoint
ALTER TABLE "event_tournament_round_match" ADD COLUMN "participant1_wins" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "event_tournament_round_match" ADD COLUMN "participant2_wins" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "event_match" ADD CONSTRAINT "event_match_event_tournament_round_match_id_event_tournament_round_match_id_fk" FOREIGN KEY ("event_tournament_round_match_id") REFERENCES "public"."event_tournament_round_match"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_match_round_match_idx" ON "event_match" USING btree ("event_tournament_round_match_id");