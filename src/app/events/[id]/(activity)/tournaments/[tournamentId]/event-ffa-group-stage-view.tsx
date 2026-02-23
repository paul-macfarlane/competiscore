"use client";

import {
  ParticipantData,
  ParticipantDisplay,
} from "@/components/participant-display";
import { TeamColorBadge } from "@/components/team-color-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoringType } from "@/lib/shared/constants";
import { FFAConfig } from "@/lib/shared/game-templates";
import { Check, Crown, Undo2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  recordFFAGroupResultAction,
  undoFFAGroupResultAction,
} from "../../../actions";
import { EditFFAGroupsDialog } from "./edit-ffa-groups-dialog";
import { RecordFFAGroupResultDialog } from "./record-ffa-group-result-dialog";

type GroupParticipantMember = {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  } | null;
  placeholderParticipant: { id: string; displayName: string } | null;
};

type GroupParticipant = {
  id: string;
  eventTournamentGroupId: string;
  eventTournamentParticipantId: string;
  rank: number | null;
  score: number | null;
  advanced: boolean;
  tournamentParticipant: {
    id: string;
    seed: number | null;
    team: {
      id: string;
      name: string;
      logo: string | null;
      color: string | null;
    };
    user: {
      id: string;
      name: string;
      username: string;
      image: string | null;
    } | null;
    placeholderParticipant: { id: string; displayName: string } | null;
    members?: GroupParticipantMember[];
  };
};

type Group = {
  id: string;
  eventTournamentId: string;
  round: number;
  position: number;
  advanceCount: number;
  eventMatchId: string | null;
  isCompleted: boolean;
  participants: GroupParticipant[];
};

type Props = {
  eventTournamentId: string;
  groups: Group[];
  totalRounds: number;
  canManage: boolean;
  userParticipantIds: string[];
  isTeamTournament: boolean;
  isCompleted: boolean;
  ffaConfig: FFAConfig;
};

export function EventFFAGroupStageView({
  eventTournamentId,
  groups,
  totalRounds,
  canManage,
  userParticipantIds,
  isTeamTournament,
  isCompleted,
  ffaConfig,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [recordDialogGroup, setRecordDialogGroup] = useState<Group | null>(
    null,
  );

  const groupsByRound = useMemo(() => {
    const map = new Map<number, Group[]>();
    for (const group of groups) {
      const existing = map.get(group.round) ?? [];
      existing.push(group);
      map.set(group.round, existing);
    }
    return map;
  }, [groups]);

  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  const canUndoGroup = (group: Group, round: number) => {
    if (!group.isCompleted || isCompleted) return false;
    const nextRoundGroups = groupsByRound.get(round + 1) ?? [];
    const hasCompletedNextRound = nextRoundGroups.some((g) => g.isCompleted);
    if (hasCompletedNextRound) return false;
    const isUserInGroup = group.participants.some((gp) =>
      userParticipantIds.includes(gp.eventTournamentParticipantId),
    );
    return canManage || isUserInGroup;
  };

  const canRecordGroup = (group: Group) => {
    if (group.isCompleted || isCompleted) return false;
    const isUserInGroup = group.participants.some((gp) =>
      userParticipantIds.includes(gp.eventTournamentParticipantId),
    );
    return canManage || isUserInGroup;
  };

  const handleUndo = (groupId: string) => {
    startTransition(async () => {
      const result = await undoFFAGroupResultAction({ groupId });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Group result undone");
        router.refresh();
      }
    });
  };

  const handleRecordResult = (
    groupId: string,
    playedAt: Date,
    results: { participantId: string; rank?: number; score?: number }[],
  ) => {
    startTransition(async () => {
      const result = await recordFFAGroupResultAction({
        groupId,
        playedAt: playedAt.toISOString(),
        results,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Group result recorded");
        setRecordDialogGroup(null);
        router.refresh();
      }
    });
  };

  return (
    <>
      <Tabs defaultValue="1">
        <TabsList>
          {rounds.map((round) => {
            const roundGroups = groupsByRound.get(round) ?? [];
            const hasGroups = roundGroups.length > 0;
            return (
              <TabsTrigger
                key={round}
                value={String(round)}
                disabled={!hasGroups}
              >
                {round === totalRounds ? "Final" : `Round ${round}`}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {rounds.map((round) => {
          const roundGroups = groupsByRound.get(round) ?? [];
          const allCompleted =
            roundGroups.length > 0 && roundGroups.every((g) => g.isCompleted);

          return (
            <TabsContent key={round} value={String(round)}>
              {roundGroups.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  Groups for this round will be generated after the previous
                  round is completed.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {allCompleted && round < totalRounds && (
                      <Badge variant="outline">All groups completed</Badge>
                    )}
                    {canManage &&
                      roundGroups.length > 0 &&
                      !roundGroups.some((g) => g.isCompleted) && (
                        <EditFFAGroupsDialog
                          eventTournamentId={eventTournamentId}
                          round={round}
                          groups={roundGroups}
                          isTeamTournament={isTeamTournament}
                        />
                      )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {roundGroups.map((group) => (
                      <FFAGroupCard
                        key={group.id}
                        group={group}
                        round={round}
                        totalRounds={totalRounds}
                        isTeamTournament={isTeamTournament}
                        ffaConfig={ffaConfig}
                        canRecord={canRecordGroup(group)}
                        canUndo={canUndoGroup(group, round)}
                        isPending={isPending}
                        onRecord={() => setRecordDialogGroup(group)}
                        onUndo={() => handleUndo(group.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {recordDialogGroup && (
        <RecordFFAGroupResultDialog
          key={recordDialogGroup.id}
          open={!!recordDialogGroup}
          onOpenChange={(open) => {
            if (!open) setRecordDialogGroup(null);
          }}
          group={recordDialogGroup}
          isTeamTournament={isTeamTournament}
          ffaConfig={ffaConfig}
          isPending={isPending}
          onSubmit={handleRecordResult}
        />
      )}
    </>
  );
}

function FFAGroupCard({
  group,
  round,
  totalRounds,
  isTeamTournament,
  ffaConfig,
  canRecord,
  canUndo,
  isPending,
  onRecord,
  onUndo,
}: {
  group: Group;
  round: number;
  totalRounds: number;
  isTeamTournament: boolean;
  ffaConfig: FFAConfig;
  canRecord: boolean;
  canUndo: boolean;
  isPending: boolean;
  onRecord: () => void;
  onUndo: () => void;
}) {
  const isFinalRound = round === totalRounds;
  const sortedParticipants = [...group.participants].sort((a, b) => {
    if (group.isCompleted) {
      if (a.rank !== null && b.rank !== null) return a.rank - b.rank;
      if (a.rank !== null) return -1;
      if (b.rank !== null) return 1;
    }
    const seedA = a.tournamentParticipant.seed ?? 999;
    const seedB = b.tournamentParticipant.seed ?? 999;
    return seedA - seedB;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>
            {isFinalRound && group.position === 1
              ? "Final"
              : `Group ${group.position}`}
          </span>
          {group.isCompleted ? (
            <Badge variant="outline" className="text-xs">
              Completed
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Pending
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sortedParticipants.map((gp) => {
          const tp = gp.tournamentParticipant;
          const hasMembers = tp.members && tp.members.length > 0;

          const participant: ParticipantData = isTeamTournament
            ? { team: tp.team }
            : {
                user: tp.user,
                placeholderMember: tp.placeholderParticipant,
              };

          return (
            <div
              key={gp.id}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                group.isCompleted && gp.advanced
                  ? "bg-green-50 dark:bg-green-950/20"
                  : group.isCompleted && !gp.advanced
                    ? "opacity-50"
                    : ""
              }`}
            >
              {group.isCompleted && (
                <span className="w-5 shrink-0 text-center">
                  {gp.advanced ? (
                    isFinalRound && gp.rank === 1 ? (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Check className="h-4 w-4 text-green-600" />
                    )
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
              )}
              {group.isCompleted && gp.rank !== null && (
                <span className="w-5 shrink-0 text-center text-xs font-medium text-muted-foreground">
                  #{gp.rank}
                </span>
              )}
              <div className="flex flex-1 items-center gap-1.5 min-w-0">
                {hasMembers ? (
                  <span className="truncate font-medium">
                    {tp
                      .members!.map(
                        (m) =>
                          m.user?.name ??
                          m.placeholderParticipant?.displayName ??
                          "Unknown",
                      )
                      .join(" & ")}
                  </span>
                ) : (
                  <ParticipantDisplay
                    participant={participant}
                    showAvatar
                    size="sm"
                  />
                )}
                {!isTeamTournament &&
                  !hasMembers &&
                  (tp.team.color ? (
                    <TeamColorBadge name={tp.team.name} color={tp.team.color} />
                  ) : (
                    <span className="text-muted-foreground text-xs truncate">
                      ({tp.team.name})
                    </span>
                  ))}
              </div>
              {group.isCompleted &&
                gp.score !== null &&
                ffaConfig.scoringType === ScoringType.SCORE_BASED && (
                  <span className="text-xs font-medium text-muted-foreground shrink-0">
                    {gp.score}
                  </span>
                )}
              {tp.seed !== null && !group.isCompleted && (
                <span className="text-xs text-muted-foreground shrink-0">
                  #{tp.seed}
                </span>
              )}
            </div>
          );
        })}

        {(canRecord || canUndo) && (
          <div className="flex gap-2 pt-2">
            {canRecord && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRecord}
                disabled={isPending}
                className="flex-1"
              >
                Record Result
              </Button>
            )}
            {canUndo && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onUndo}
                disabled={isPending}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
