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

type TeamContributionChartProps = {
  individualContributions: IndividualContributionData[];
};

const MAX_CONTRIBUTORS_PER_TEAM = 5;

export function TeamContributionChart({
  individualContributions,
}: TeamContributionChartProps) {
  if (individualContributions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {individualContributions.map((team) => (
            <TeamSection key={team.teamId} team={team} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamSection({ team }: { team: IndividualContributionData }) {
  const sorted = [...team.contributors]
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
    .slice(0, MAX_CONTRIBUTORS_PER_TEAM);

  if (sorted.length === 0) return null;

  const teamColor = getTeamColorHex(team.teamColor);

  const data = sorted.map((c) => ({
    name: c.name,
    points: c.points,
  }));

  const config: ChartConfig = Object.fromEntries(
    data.map((entry) => [entry.name, { label: entry.name, color: teamColor }]),
  );

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{team.teamName}</h3>
      <ChartContainer
        config={config}
        className="aspect-auto"
        style={{ height: `${Math.max(data.length * 36, 80)}px` }}
      >
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 60 }}>
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            width={90}
            tick={{ fontSize: 11 }}
          />
          <XAxis type="number" hide />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideIndicator
                formatter={(value, _name, item) => (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.payload.name}</span>
                    <span className="font-mono font-bold tabular-nums">
                      {value} pts
                    </span>
                  </div>
                )}
              />
            }
          />
          <Bar dataKey="points" radius={[0, 4, 4, 0]}>
            {data.map((_entry, index) => (
              <Cell key={index} fill={teamColor} />
            ))}
            <LabelList
              dataKey="points"
              position="right"
              className="fill-foreground"
              fontSize={11}
              formatter={(value: number) => `${value} pts`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
