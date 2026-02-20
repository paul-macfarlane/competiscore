"use client";

import {
  ParticipantData,
  ParticipantDisplay,
} from "@/components/participant-display";
import {
  RecordH2HMatchForm,
  TournamentMatchProps,
} from "@/components/record-h2h-match-form";
import { TournamentBracket } from "@/components/tournament-bracket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TournamentRoundMatchWithDetails } from "@/db/tournaments";
import { H2HConfig } from "@/lib/shared/game-templates";
import { ParticipantOption } from "@/lib/shared/participant-options";
import { cn } from "@/lib/shared/utils";
import { CheckCircle2, Eye, Pencil, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { recordTournamentMatchResultAction } from "../actions";

type TournamentBracketViewProps = {
  bracket: TournamentRoundMatchWithDetails[];
  totalRounds: number;
  canManage: boolean;
  userParticipantIds?: string[];
  config: H2HConfig;
  leagueId: string;
  gameTypeId: string;
};

function getParticipantName(
  participant: TournamentRoundMatchWithDetails["participant1"],
): string {
  if (!participant) return "TBD";
  if (participant.user) return participant.user.name;
  if (participant.team) return participant.team.name;
  if (participant.placeholderMember)
    return participant.placeholderMember.displayName;
  return "TBD";
}

export function TournamentBracketView({
  bracket,
  totalRounds,
  canManage,
  userParticipantIds = [],
  config,
  leagueId,
  gameTypeId,
}: TournamentBracketViewProps) {
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] =
    useState<TournamentRoundMatchWithDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMatchClick = (match: TournamentRoundMatchWithDetails) => {
    setSelectedMatch(match);
    setDialogOpen(true);
  };

  const handleViewMatch = (matchId: string) => {
    router.push(`/leagues/${leagueId}/matches/${matchId}`);
  };

  const handleSuccess = () => {
    setDialogOpen(false);
    router.refresh();
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const finalMatch = bracket.find((m) => m.round === totalRounds && m.winnerId);
  const championParticipantId = finalMatch?.winnerId ?? undefined;

  const tournamentMatch: TournamentMatchProps | undefined = selectedMatch
    ? {
        tournamentMatchId: selectedMatch.id,
        side1Name: getParticipantName(selectedMatch.participant1),
        side2Name: getParticipantName(selectedMatch.participant2),
        side1Participant: selectedMatch.participant1
          ? {
              user: selectedMatch.participant1.user,
              team: selectedMatch.participant1.team,
              placeholderMember: selectedMatch.participant1.placeholderMember,
            }
          : undefined,
        side2Participant: selectedMatch.participant2
          ? {
              user: selectedMatch.participant2.user,
              team: selectedMatch.participant2.team,
              placeholderMember: selectedMatch.participant2.placeholderMember,
            }
          : undefined,
        onSubmitAction: recordTournamentMatchResultAction,
      }
    : undefined;

  const renderMatchCard = (match: TournamentRoundMatchWithDetails) => {
    const isReadyToPlay =
      !match.winnerId &&
      !match.isBye &&
      !!match.participant1Id &&
      !!match.participant2Id;

    const isUserInMatch =
      userParticipantIds.includes(match.participant1Id ?? "") ||
      userParticipantIds.includes(match.participant2Id ?? "");

    const canRecord = isReadyToPlay && (canManage || isUserInMatch);
    const isCompleted = !!match.winnerId && !match.isBye;
    const canView = isCompleted && !!match.matchId;
    const isClickable = canRecord || canView;

    const handleClick = () => {
      if (canRecord) {
        handleMatchClick(match);
      } else if (canView && match.matchId) {
        handleViewMatch(match.matchId);
      }
    };

    return (
      <div
        className={cn(
          "w-[240px] rounded-lg border bg-card text-card-foreground shadow-sm",
          isClickable &&
            "cursor-pointer hover:border-primary hover:shadow-md transition-all",
          match.isBye && "opacity-60",
        )}
        onClick={handleClick}
      >
        <MatchSlot
          participant={match.participant1}
          isWinner={match.winnerId === match.participant1Id}
          isSet={!!match.participant1Id}
          score={match.participant1Score}
          showScore={isCompleted}
        />
        <div className="border-t" />
        <MatchSlot
          participant={match.isBye ? null : match.participant2}
          isWinner={!match.isBye && match.winnerId === match.participant2Id}
          isSet={!!match.participant2Id}
          isBye={match.isBye}
          score={match.participant2Score}
          showScore={isCompleted}
        />
        {match.winnerId && match.round === totalRounds && (
          <div className="border-t px-3 py-1 flex items-center justify-center gap-1 text-xs font-medium text-rank-gold-text bg-rank-gold-bg">
            <Trophy className="h-3 w-3" />
            Champion
          </div>
        )}
        {match.isForfeit && match.winnerId && (
          <div className="border-t px-3 py-1 text-center text-xs text-muted-foreground">
            Forfeit
          </div>
        )}
        {canRecord && (
          <div className="border-t px-3 py-1 flex items-center justify-center gap-1 text-xs font-medium text-primary">
            <Pencil className="h-3 w-3" />
            Record Result
          </div>
        )}
        {isCompleted && !match.isForfeit && canView && (
          <div className="border-t px-3 py-1 flex items-center justify-center gap-1 text-xs font-medium text-primary">
            <Eye className="h-3 w-3" />
            View Details
          </div>
        )}
        {isCompleted && !match.isForfeit && !canView && (
          <div className="border-t px-3 py-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <TournamentBracket
        bracket={bracket}
        totalRounds={totalRounds}
        renderMatchCard={renderMatchCard}
        championParticipantId={championParticipantId}
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Match Result</DialogTitle>
          </DialogHeader>
          {selectedMatch && tournamentMatch && (
            <RecordH2HMatchForm
              leagueId={leagueId}
              gameTypeId={gameTypeId}
              config={config}
              participantOptions={[] as ParticipantOption[]}
              currentUserId=""
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              tournamentMatch={tournamentMatch}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

type MatchSlotParticipant = ParticipantData & { seed?: number | null };

function MatchSlot({
  participant,
  isWinner,
  isSet,
  isBye,
  score,
  showScore,
}: {
  participant: MatchSlotParticipant | null;
  isWinner: boolean;
  isSet: boolean;
  isBye?: boolean;
  score?: number | null;
  showScore?: boolean;
}) {
  if (isBye) {
    return (
      <div className="px-3 py-2 text-xs text-muted-foreground italic">BYE</div>
    );
  }

  if (!participant || !isSet) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground italic">TBD</div>
    );
  }

  return (
    <div
      className={cn(
        "px-3 py-2 flex items-center gap-2",
        isWinner && "bg-primary/10",
      )}
    >
      {participant.seed && (
        <span className="text-xs font-mono text-muted-foreground shrink-0">
          #{participant.seed}
        </span>
      )}
      <ParticipantDisplay
        participant={participant}
        showAvatar
        showUsername
        size="sm"
        className={cn("min-w-0 flex-1", isWinner && "font-semibold")}
      />
      {showScore && score != null && (
        <span
          className={cn(
            "text-sm font-mono tabular-nums shrink-0",
            isWinner
              ? "font-semibold text-foreground"
              : "text-muted-foreground",
          )}
        >
          {score}
        </span>
      )}
    </div>
  );
}
