import { LeagueBreadcrumb } from "@/components/league-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/server/auth";
import { EventParticipantRole, EventStatus } from "@/lib/shared/constants";
import { EVENT_ROLE_LABELS } from "@/lib/shared/roles";
import { getEventMetrics } from "@/services/event-metrics";
import { getEvent } from "@/services/events";
import { idParamSchema } from "@/validators/shared";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { CategoryBarChart } from "./category-bar-chart";
import { LeaveEventButton } from "./leave-event-button";
import { MvpHighlightCard } from "./mvp-highlight-card";
import { PointsTimelineChart } from "./points-timeline-chart";
import { ScoringHistoryLog } from "./scoring-history-log";
import { StandingsBarChart } from "./standings-bar-chart";
import { TeamContributionChart } from "./team-contribution-chart";
import { TopScorersBarChart } from "./top-scorers-bar-chart";

interface EventHomePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EventHomePageProps): Promise<Metadata> {
  const rawParams = await params;
  const parsed = idParamSchema.safeParse(rawParams);
  if (!parsed.success) {
    return { title: "Event Not Found" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { title: "Event" };
  }

  const result = await getEvent(session.user.id, parsed.data.id);
  if (result.error || !result.data) {
    return { title: "Event Not Found" };
  }

  return {
    title: result.data.name,
    description: result.data.description,
  };
}

const STATUS_LABELS: Record<string, string> = {
  [EventStatus.DRAFT]: "Draft",
  [EventStatus.ACTIVE]: "Active",
  [EventStatus.COMPLETED]: "Completed",
};

const STATUS_VARIANTS: Record<string, "secondary" | "default" | "outline"> = {
  [EventStatus.DRAFT]: "outline",
  [EventStatus.ACTIVE]: "default",
  [EventStatus.COMPLETED]: "secondary",
};

export default async function EventHomePage({ params }: EventHomePageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }

  const rawParams = await params;
  const parsed = idParamSchema.safeParse(rawParams);
  if (!parsed.success) {
    notFound();
  }

  const { id } = parsed.data;

  return (
    <div className="space-y-6">
      <Suspense fallback={<EventHomeSkeleton />}>
        <EventHomeContent eventId={id} userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function EventHomeContent({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  const result = await getEvent(userId, eventId);
  if (result.error || !result.data) {
    notFound();
  }

  const event = result.data;
  const isOrganizer = event.role === EventParticipantRole.ORGANIZER;

  return (
    <>
      <LeagueBreadcrumb items={[{ label: event.name }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 items-start gap-4 min-w-0">
          {event.logo && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
              <Image
                src={event.logo}
                alt={event.name}
                fill
                className="object-cover p-1"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold md:text-3xl">
                {event.name}
              </h1>
              <Badge variant={STATUS_VARIANTS[event.status] ?? "outline"}>
                {STATUS_LABELS[event.status] ?? event.status}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                Role: {EVENT_ROLE_LABELS[event.role]}
              </Badge>
            </div>
            {event.description && (
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                {event.description}
              </p>
            )}
          </div>
        </div>
        <LeaveEventButton eventId={eventId} isOrganizer={isOrganizer} />
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        }
      >
        <EventMetricsSection eventId={eventId} userId={userId} />
      </Suspense>
    </>
  );
}

async function EventMetricsSection({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  const result = await getEventMetrics(userId, eventId);
  if (result.error || !result.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No points recorded yet. Start by recording matches!
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    log,
    cumulativeTimeline,
    individualContributions,
    categoryBreakdowns,
    leaderboard,
  } = result.data;

  const hasData = log.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No points recorded yet. Start by recording matches!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <StandingsBarChart leaderboard={leaderboard} />

      {cumulativeTimeline.length > 1 && (
        <PointsTimelineChart
          timeline={cumulativeTimeline}
          teams={leaderboard}
        />
      )}

      {individualContributions.length > 0 && (
        <MvpHighlightCard individualContributions={individualContributions} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {individualContributions.length > 0 && (
          <TopScorersBarChart
            individualContributions={individualContributions}
          />
        )}
        {categoryBreakdowns.length > 0 && (
          <CategoryBarChart categoryBreakdowns={categoryBreakdowns} />
        )}
      </div>

      {individualContributions.length > 0 && (
        <TeamContributionChart
          individualContributions={individualContributions}
        />
      )}

      <ScoringHistoryLog log={log} />
    </div>
  );
}

function EventHomeSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </CardContent>
      </Card>
    </>
  );
}
