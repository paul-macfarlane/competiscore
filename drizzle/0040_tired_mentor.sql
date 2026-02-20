CREATE TABLE "event_match_participant_member" (
	"id" text PRIMARY KEY NOT NULL,
	"event_match_participant_id" text NOT NULL,
	"user_id" text,
	"event_placeholder_participant_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_match_participant_member" ADD CONSTRAINT "event_match_participant_member_event_match_participant_id_event_match_participant_id_fk" FOREIGN KEY ("event_match_participant_id") REFERENCES "public"."event_match_participant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_match_participant_member" ADD CONSTRAINT "event_match_participant_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_match_participant_member" ADD CONSTRAINT "event_match_participant_member_event_placeholder_participant_id_event_placeholder_participant_id_fk" FOREIGN KEY ("event_placeholder_participant_id") REFERENCES "public"."event_placeholder_participant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_mpm_participant_idx" ON "event_match_participant_member" USING btree ("event_match_participant_id");--> statement-breakpoint
CREATE INDEX "event_mpm_user_idx" ON "event_match_participant_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "event_mpm_placeholder_idx" ON "event_match_participant_member" USING btree ("event_placeholder_participant_id");