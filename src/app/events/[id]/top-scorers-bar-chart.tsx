"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTeamColorHex } from "@/services/constants";
import type { IndividualContributionData } from "@/services/event-metrics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

type TopScorersBarChartProps = {
  individualContributions: IndividualContributionData[];
};

const MAX_SCORERS = 10;

export function TopScorersBarChart({
  individualContributions,
}: TopScorersBarChartProps) {
  const allContributors = individualContributions.flatMap((team) =>
    team.contributors.map((c) => ({
      name: c.name,
      points: c.points,
      teamName: team.teamName,
      teamId: team.teamId,
      teamColor: team.teamColor,
    })),
  );

  allContributors.sort(
    (a, b) => b.points - a.points || a.name.localeCompare(b.name),
  );

  const top = allContributors.slice(0, MAX_SCORERS);

  if (top.length === 0) return null;

  const data = top.map((c) => ({
    key: `${c.name}-${c.teamId}`,
    name: c.name,
    points: c.points,
    teamName: c.teamName,
    color: getTeamColorHex(c.teamColor),
  }));

  const config: ChartConfig = Object.fromEntries(
    data.map((entry) => [entry.key, { label: entry.name, color: entry.color }]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Scorers</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="aspect-auto"
          style={{ height: `${Math.max(data.length * 40, 100)}px` }}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 60 }}
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
                  hideIndicator
                  formatter={(value, _name, item) => (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{item.payload.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {item.payload.teamName}
                      </span>
                      <span className="font-mono font-bold tabular-nums">
                        {value} pts
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="points" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
              <LabelList
                dataKey="points"
                position="right"
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `${value} pts`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
