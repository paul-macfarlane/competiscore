ALTER TABLE "league_invitation" ADD COLUMN "token" text;--> statement-breakpoint
ALTER TABLE "league_invitation" ADD COLUMN "max_uses" integer;--> statement-breakpoint
ALTER TABLE "league_invitation" ADD COLUMN "use_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "league_invitation_token_idx" ON "league_invitation" USING btree ("token");--> statement-breakpoint
ALTER TABLE "league_invitation" ADD CONSTRAINT "league_invitation_token_unique" UNIQUE("token");