import { GameType } from "@/db/schema";
import { GAME_CATEGORY_LABELS, GameCategory } from "@/lib/shared/constants";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle } from "./ui/card";

type GameTypeCardProps = {
  gameType: GameType;
  leagueId: string;
};

export function GameTypeCard({ gameType, leagueId }: GameTypeCardProps) {
  const categoryLabel = GAME_CATEGORY_LABELS[gameType.category as GameCategory];

  return (
    <Link href={`/leagues/${leagueId}/game-types/${gameType.id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              {gameType.logo && (
                <div className="relative w-12 h-12 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={gameType.logo}
                    alt={gameType.name}
                    fill
                    className="object-cover p-1"
                  />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{gameType.name}</CardTitle>
                {gameType.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {gameType.description}
                  </p>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">
              {categoryLabel}
            </Badge>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
