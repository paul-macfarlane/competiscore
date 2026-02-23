"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTeamColorHex } from "@/services/constants";
import type { TeamCategoryBreakdown } from "@/services/event-metrics";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

  const teams = categoryBreakdowns.map((team) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    color: getTeamColorHex(team.teamColor),
  }));

  // Each row is a category, with a key per team holding that team's points
  const data = categories.map((category) => {
    const row: Record<string, string | number> = {
      name: categoryLabelMap.get(category) ?? category,
    };
    for (const team of categoryBreakdowns) {
      const cat = team.categories.find((c) => c.category === category);
      row[team.teamId] = cat?.points ?? 0;
    }
    return row;
  });

  // Sort by total points descending
  data.sort((a, b) => {
    const totalA = teams.reduce(
      (s, t) => s + ((a[t.teamId] as number) || 0),
      0,
    );
    const totalB = teams.reduce(
      (s, t) => s + ((b[t.teamId] as number) || 0),
      0,
    );
    return totalB - totalA;
  });

  const config: ChartConfig = Object.fromEntries(
    teams.map((t) => [t.teamId, { label: t.teamName, color: t.color }]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Points by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="aspect-auto"
          style={{ height: `${Math.max(data.length * 48, 100)}px` }}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
              tick={{ fontSize: 12 }}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const team = teams.find((t) => t.teamId === name);
                    return (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-[2px]"
                          style={{
                            backgroundColor: team?.color ?? "#94a3b8",
                          }}
                        />
                        <span className="font-medium">
                          {team?.teamName ?? name}
                        </span>
                        <span className="font-mono font-bold tabular-nums">
                          {value} pts
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {teams.map((team, i) => (
              <Bar
                key={team.teamId}
                dataKey={team.teamId}
                stackId="category"
                fill={team.color}
                radius={i === teams.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
