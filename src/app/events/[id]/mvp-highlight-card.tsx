import { Card, CardContent } from "@/components/ui/card";
import { getTeamColorHex } from "@/services/constants";
import type { IndividualContributionData } from "@/services/event-metrics";
import { Trophy } from "lucide-react";

type MvpHighlightCardProps = {
  individualContributions: IndividualContributionData[];
};

export function MvpHighlightCard({
  individualContributions,
}: MvpHighlightCardProps) {
  const allContributors = individualContributions.flatMap((team) =>
    team.contributors
      .filter((c) => c.name !== team.teamName)
      .map((c) => ({
        name: c.name,
        points: c.points,
        teamName: team.teamName,
        teamColor: team.teamColor,
      })),
  );

  if (allContributors.length === 0) return null;

  allContributors.sort(
    (a, b) => b.points - a.points || a.name.localeCompare(b.name),
  );

  const mvp = allContributors[0];

  return (
    <Card
      className="border-l-4"
      style={{ borderLeftColor: getTeamColorHex(mvp.teamColor) }}
    >
      <CardContent className="flex items-center gap-4 py-4">
        <Trophy className="text-yellow-500 h-8 w-8 shrink-0" />
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Event MVP
          </p>
          <p className="truncate text-lg font-bold">{mvp.name}</p>
          <p className="text-muted-foreground text-sm">{mvp.teamName}</p>
        </div>
        <p className="ml-auto shrink-0 text-2xl font-bold tabular-nums font-mono">
          {mvp.points} pts
        </p>
      </CardContent>
    </Card>
  );
}
