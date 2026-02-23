"use client";

import {
  ParticipantData,
  ParticipantDisplay,
} from "@/components/participant-display";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScoreOrder, ScoringType } from "@/lib/shared/constants";
import { FFAConfig } from "@/lib/shared/game-templates";
import { useCallback, useMemo, useState } from "react";

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
  isTeamTournament: boolean;
  ffaConfig: FFAConfig;
  isPending: boolean;
  onSubmit: (
    groupId: string,
    playedAt: Date,
    results: { participantId: string; rank?: number; score?: number }[],
  ) => void;
};

export function RecordFFAGroupResultDialog({
  open,
  onOpenChange,
  group,
  isTeamTournament,
  ffaConfig,
  isPending,
  onSubmit,
}: Props) {
  const isScoreBased = ffaConfig.scoringType === ScoringType.SCORE_BASED;
  const isLowestWins = ffaConfig.scoreOrder === ScoreOrder.LOWEST_WINS;

  const [ranks, setRanks] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, string>>({});

  const getParticipantName = useCallback(
    (gp: GroupParticipant): string => {
      const tp = gp.tournamentParticipant;
      if (tp.members && tp.members.length > 0) {
        return tp.members
          .map(
            (m) =>
              m.user?.name ??
              m.placeholderParticipant?.displayName ??
              "Unknown",
          )
          .join(" & ");
      }
      if (isTeamTournament) return tp.team.name;
      return (
        tp.user?.name ?? tp.placeholderParticipant?.displayName ?? "Unknown"
      );
    },
    [isTeamTournament],
  );

  const computedRanks = useMemo(() => {
    if (!isScoreBased) return null;

    const entries = group.participants
      .map((gp) => ({
        participantId: gp.eventTournamentParticipantId,
        score: scores[gp.eventTournamentParticipantId],
      }))
      .filter((e) => e.score !== undefined && e.score !== "");

    if (entries.length === 0) return null;

    const sorted = [...entries].sort((a, b) => {
      const scoreA = parseFloat(a.score!);
      const scoreB = parseFloat(b.score!);
      if (isNaN(scoreA) || isNaN(scoreB)) return 0;
      return isLowestWins ? scoreA - scoreB : scoreB - scoreA;
    });

    const rankMap: Record<string, number> = {};
    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (
        i > 0 &&
        parseFloat(sorted[i].score!) !== parseFloat(sorted[i - 1].score!)
      ) {
        currentRank = i + 1;
      }
      rankMap[sorted[i].participantId] = currentRank;
    }
    return rankMap;
  }, [scores, group.participants, isScoreBased, isLowestWins]);

  const isValid = useMemo(() => {
    if (isScoreBased) {
      return group.participants.every((gp) => {
        const val = scores[gp.eventTournamentParticipantId];
        return val !== undefined && val !== "" && !isNaN(parseFloat(val));
      });
    }
    return group.participants.every((gp) => {
      const val = ranks[gp.eventTournamentParticipantId];
      if (!val || val === "") return false;
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1;
    });
  }, [isScoreBased, group.participants, scores, ranks]);

  const handleSubmit = () => {
    const results = group.participants.map((gp) => {
      const pid = gp.eventTournamentParticipantId;
      if (isScoreBased) {
        return {
          participantId: pid,
          score: parseFloat(scores[pid]),
          rank: computedRanks?.[pid],
        };
      }
      return {
        participantId: pid,
        rank: parseInt(ranks[pid], 10),
      };
    });

    onSubmit(group.id, new Date(), results);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Group {group.position} Result</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {isScoreBased && (
            <p className="text-muted-foreground text-sm">
              Enter scores for each participant.{" "}
              {isLowestWins ? "Lowest score wins." : "Highest score wins."}{" "}
              Rankings will be calculated automatically.
            </p>
          )}
          {!isScoreBased && (
            <p className="text-muted-foreground text-sm">
              Enter the finishing rank for each participant (1 = winner).
            </p>
          )}

          {group.participants.map((gp) => {
            const pid = gp.eventTournamentParticipantId;
            const tp = gp.tournamentParticipant;
            const hasMembers = tp.members && tp.members.length > 0;
            const participant: ParticipantData = isTeamTournament
              ? { team: tp.team }
              : {
                  user: tp.user,
                  placeholderMember: tp.placeholderParticipant,
                };

            return (
              <div key={gp.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  {hasMembers ? (
                    <span className="text-sm font-medium truncate">
                      {getParticipantName(gp)}
                    </span>
                  ) : (
                    <ParticipantDisplay
                      participant={participant}
                      showAvatar
                      size="sm"
                    />
                  )}
                </div>

                {isScoreBased ? (
                  <div className="flex items-center gap-2">
                    <div className="w-24">
                      <Label className="sr-only">
                        Score for {getParticipantName(gp)}
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Score"
                        value={scores[pid] ?? ""}
                        onChange={(e) =>
                          setScores((prev) => ({
                            ...prev,
                            [pid]: e.target.value,
                          }))
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                    {computedRanks?.[pid] && (
                      <span className="text-xs text-muted-foreground w-6 text-center">
                        #{computedRanks[pid]}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-20">
                    <Label className="sr-only">
                      Rank for {getParticipantName(gp)}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={group.participants.length}
                      step={1}
                      placeholder="Rank"
                      value={ranks[pid] ?? ""}
                      onChange={(e) =>
                        setRanks((prev) => ({
                          ...prev,
                          [pid]: e.target.value,
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending ? "Recording..." : "Record Result"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
