"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeamColorHex } from "@/services/constants";
import type { TeamCategoryBreakdown } from "@/services/event-metrics";

type CategoryBarChartProps = {
  categoryBreakdowns: TeamCategoryBreakdown[];
};

export function CategoryBarChart({
  categoryBreakdowns,
}: CategoryBarChartProps) {
  if (categoryBreakdowns.length === 0) return null;

  const categorySet = new Set<string>();
  const categoryLabelMap = new Map<string, string>();
  for (const team of categoryBreakdowns) {
    for (const cat of team.categories) {
      categorySet.add(cat.category);
      categoryLabelMap.set(cat.category, cat.categoryLabel);
    }
  }

  const categories = Array.from(categorySet);

  const categoryData = categories.map((category) => {
    const teams = categoryBreakdowns
      .map((team) => {
        const cat = team.categories.find((c) => c.category === category);
        return {
          teamId: team.teamId,
          teamName: team.teamName,
          teamColor: team.teamColor,
          points: cat?.points ?? 0,
        };
      })
      .sort((a, b) => b.points - a.points);

    return {
      category,
      label: categoryLabelMap.get(category) ?? category,
      teams,
    };
  });

  // Sort categories by total points descending
  categoryData.sort((a, b) => {
    const totalA = a.teams.reduce((s, t) => s + t.points, 0);
    const totalB = b.teams.reduce((s, t) => s + t.points, 0);
    return totalB - totalA;
  });

  const maxPoints = Math.max(
    ...categoryData.flatMap((c) => c.teams.map((t) => Math.abs(t.points))),
    1,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Points by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {categoryData.map((cat) => (
            <div key={cat.category} className="py-3 first:pt-0 last:pb-0">
              <p className="mb-2 text-sm font-medium">{cat.label}</p>
              <div className="space-y-1.5">
                {cat.teams.map((team) => {
                  const color = getTeamColorHex(team.teamColor);
                  const widthPct = Math.max(
                    (Math.abs(team.points) / maxPoints) * 100,
                    2,
                  );

                  return (
                    <div key={team.teamId} className="flex items-center gap-2">
                      <span className="w-20 shrink-0 truncate text-xs text-muted-foreground">
                        {team.teamName}
                      </span>
                      <div className="relative h-5 flex-1">
                        <div
                          className="absolute inset-y-0 left-0 rounded-r"
                          style={{
                            width: `${widthPct}%`,
                            backgroundColor: color,
                            opacity: 0.8,
                          }}
                        />
                      </div>
                      <span className="w-14 shrink-0 text-right font-mono text-xs font-semibold tabular-nums">
                        {team.points} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
