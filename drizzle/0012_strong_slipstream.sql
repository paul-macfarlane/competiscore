CREATE TYPE "public"."game_category" AS ENUM('head_to_head', 'free_for_all', 'high_score');--> statement-breakpoint
CREATE TABLE "game_type" (
	"id" text PRIMARY KEY NOT NULL,
	"league_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"logo" text,
	"category" "game_category" NOT NULL,
	"config" text NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_type" ADD CONSTRAINT "game_type_league_id_league_id_fk" FOREIGN KEY ("league_id") REFERENCES "public"."league"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "game_type_league_idx" ON "game_type" USING btree ("league_id");--> statement-breakpoint
CREATE INDEX "game_type_name_league_idx" ON "game_type" USING btree ("league_id","name");