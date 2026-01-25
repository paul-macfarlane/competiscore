import { MarkdownViewer } from "@/components/markdown-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/server/auth";
import {
  GAME_CATEGORY_LABELS,
  GameCategory,
  ParticipantType,
  ScoreOrder,
  ScoringType,
} from "@/lib/shared/constants";
import {
  FFAConfig,
  H2HConfig,
  HighScoreConfig,
} from "@/lib/shared/game-templates";
import { LeagueAction, canPerformAction } from "@/lib/shared/permissions";
import { getGameType } from "@/services/game-types";
import { getLeagueWithRole } from "@/services/leagues";
import { Settings } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string; gameTypeId: string }>;
};

export default async function GameTypeDetailPage({ params }: PageProps) {
  const { id: leagueId, gameTypeId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }

  const [gameTypeResult, leagueResult] = await Promise.all([
    getGameType(session.user.id, gameTypeId),
    getLeagueWithRole(leagueId, session.user.id),
  ]);

  if (gameTypeResult.error || !gameTypeResult.data) {
    notFound();
  }

  if (leagueResult.error || !leagueResult.data) {
    notFound();
  }

  const gameType = gameTypeResult.data;
  const league = leagueResult.data;
  const canManage = canPerformAction(
    league.role,
    LeagueAction.CREATE_GAME_TYPES,
  );

  const config = JSON.parse(gameType.config);
  const categoryLabel = GAME_CATEGORY_LABELS[gameType.category as GameCategory];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={`/leagues/${leagueId}/game-types`}
        className="text-muted-foreground hover:text-foreground text-sm inline-block"
      >
        ← Back to game types
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {gameType.logo && (
            <div className="relative w-16 h-16 flex items-center justify-center bg-muted rounded-lg shrink-0 overflow-hidden">
              <Image
                src={gameType.logo}
                alt={gameType.name}
                fill
                className="object-cover p-2"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{gameType.name}</h1>
            {gameType.description && (
              <p className="text-muted-foreground mt-1">
                {gameType.description}
              </p>
            )}
            <Badge variant="secondary" className="mt-2">
              {categoryLabel}
            </Badge>
          </div>
        </div>
        {canManage && (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/leagues/${leagueId}/game-types/${gameTypeId}/settings`}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {gameType.category === GameCategory.HEAD_TO_HEAD && (
            <H2HConfigDisplay config={config as H2HConfig} />
          )}
          {gameType.category === GameCategory.FREE_FOR_ALL && (
            <FFAConfigDisplay config={config as FFAConfig} />
          )}
          {gameType.category === GameCategory.HIGH_SCORE && (
            <HighScoreConfigDisplay config={config as HighScoreConfig} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Match recording coming in Phase 2 Step 3</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Leaderboards coming in Phase 2 Step 5</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function H2HConfigDisplay({ config }: { config: H2HConfig }) {
  return (
    <>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Scoring Type:</span>
        <span className="font-medium">
          {config.scoringType === ScoringType.WIN_LOSS
            ? "Win/Loss Only"
            : "Score-Based"}
        </span>
      </div>
      {config.scoreDescription && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Score Label:</span>
          <span className="font-medium">{config.scoreDescription}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Draws Allowed:</span>
        <span className="font-medium">
          {config.drawsAllowed ? "Yes" : "No"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Players Per Side:</span>
        <span className="font-medium">
          {config.minPlayersPerSide === config.maxPlayersPerSide
            ? config.minPlayersPerSide
            : `${config.minPlayersPerSide}-${config.maxPlayersPerSide}`}
        </span>
      </div>
      {config.rules && (
        <div className="space-y-2 pt-2 border-t">
          <span className="text-muted-foreground text-sm font-medium">
            Rules:
          </span>
          <div className="bg-muted/50 rounded-md p-3">
            <MarkdownViewer content={config.rules} />
          </div>
        </div>
      )}
    </>
  );
}

function FFAConfigDisplay({ config }: { config: FFAConfig }) {
  return (
    <>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Scoring Type:</span>
        <span className="font-medium">
          {config.scoringType === ScoringType.RANKED_FINISH
            ? "Ranked Finish"
            : "Score-Based Ranking"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Score Order:</span>
        <span className="font-medium">
          {config.scoreOrder === ScoreOrder.HIGHEST_WINS
            ? "Highest Wins"
            : "Lowest Wins"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Player Range:</span>
        <span className="font-medium">
          {config.minPlayers === config.maxPlayers
            ? config.minPlayers
            : `${config.minPlayers}-${config.maxPlayers}`}{" "}
          players
        </span>
      </div>
      {config.rules && (
        <div className="space-y-2 pt-2 border-t">
          <span className="text-muted-foreground text-sm font-medium">
            Rules:
          </span>
          <div className="bg-muted/50 rounded-md p-3">
            <MarkdownViewer content={config.rules} />
          </div>
        </div>
      )}
    </>
  );
}

function HighScoreConfigDisplay({ config }: { config: HighScoreConfig }) {
  return (
    <>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Score Order:</span>
        <span className="font-medium">
          {config.scoreOrder === ScoreOrder.HIGHEST_WINS
            ? "Highest Wins"
            : "Lowest Wins"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Score Label:</span>
        <span className="font-medium">{config.scoreDescription}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Participant Type:</span>
        <span className="font-medium">
          {config.participantType === ParticipantType.INDIVIDUAL
            ? "Individual"
            : "Team"}
        </span>
      </div>
      {config.rules && (
        <div className="space-y-2 pt-2 border-t">
          <span className="text-muted-foreground text-sm font-medium">
            Rules:
          </span>
          <div className="bg-muted/50 rounded-md p-3">
            <MarkdownViewer content={config.rules} />
          </div>
        </div>
      )}
    </>
  );
}
