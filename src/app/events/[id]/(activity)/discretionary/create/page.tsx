import { LeagueBreadcrumb } from "@/components/league-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/server/auth";
import { EventParticipantRole, EventStatus } from "@/lib/shared/constants";
import { getEventTeams } from "@/services/event-teams";
import { getEvent } from "@/services/events";
import { idParamSchema } from "@/validators/shared";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { CreateDiscretionaryForm } from "./create-discretionary-form";

interface CreateDiscretionaryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CreateDiscretionaryPageProps): Promise<Metadata> {
  const rawParams = await params;
  const parsed = idParamSchema.safeParse(rawParams);
  if (!parsed.success) {
    return { title: "Event Not Found" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { title: "Award Points" };
  }

  const result = await getEvent(session.user.id, parsed.data.id);
  if (result.error || !result.data) {
    return { title: "Award Points" };
  }

  return {
    title: `Award Points - ${result.data.name}`,
    description: `Award discretionary points for ${result.data.name}`,
  };
}

export default async function CreateDiscretionaryPage({
  params,
}: CreateDiscretionaryPageProps) {
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
      <Suspense fallback={<CreateDiscretionarySkeleton />}>
        <CreateDiscretionaryContent eventId={id} userId={session.user.id} />
      </Suspense>
    </div>
  );
}

async function CreateDiscretionaryContent({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  const eventResult = await getEvent(userId, eventId);
  if (eventResult.error || !eventResult.data) {
    notFound();
  }

  const event = eventResult.data;

  if (event.role !== EventParticipantRole.ORGANIZER) {
    redirect(`/events/${eventId}/discretionary`);
  }

  if (event.status !== EventStatus.ACTIVE) {
    redirect(`/events/${eventId}/discretionary`);
  }

  const teamsResult = await getEventTeams(userId, eventId);
  const teams = (teamsResult.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
  }));

  return (
    <>
      <LeagueBreadcrumb
        items={[
          { label: event.name, href: `/events/${eventId}` },
          { label: "Discretionary", href: `/events/${eventId}/discretionary` },
          { label: "Award Points" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold">Award Discretionary Points</h1>
        <p className="text-muted-foreground">
          Award bonus points for special achievements or activities
        </p>
      </div>

      <CreateDiscretionaryForm eventId={eventId} teams={teams} />
    </>
  );
}

function CreateDiscretionarySkeleton() {
  return (
    <>
      <Skeleton className="h-5 w-64" />
      <div className="space-y-4 rounded-lg border p-4 md:p-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </>
  );
}
