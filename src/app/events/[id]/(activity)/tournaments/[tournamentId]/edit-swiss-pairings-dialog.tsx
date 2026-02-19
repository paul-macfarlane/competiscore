"use client";

import {
  ParticipantData,
  ParticipantDisplay,
} from "@/components/participant-display";
import { TeamColorBadge } from "@/components/team-color-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateSwissRoundPairingsAction } from "../../../actions";

type PartnershipMember = {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  } | null;
  placeholderParticipant: { id: string; displayName: string } | null;
};

type BracketParticipant = {
  id: string;
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
  members?: PartnershipMember[];
};

type BracketMatch = {
  id: string;
  round: number;
  position: number;
  participant1Id: string | null;
  participant2Id: string | null;
  participant1?: BracketParticipant | null;
  participant2?: BracketParticipant | null;
  participant1Score: number | null;
  participant2Score: number | null;
  winnerId: string | null;
  isDraw: boolean;
  isBye: boolean;
  isForfeit: boolean;
};

type PairingEntry = {
  matchId: string;
  participant1Id: string;
  participant2Id: string | null;
  isBye: boolean;
};

type Props = {
  eventTournamentId: string;
  round: number;
  matches: BracketMatch[];
  isTeamTournament: boolean;
  participantMap: Map<string, BracketParticipant>;
};

function renderParticipant(
  participant: BracketParticipant | undefined,
  isTeamTournament: boolean,
) {
  if (!participant) return <span className="text-muted-foreground">TBD</span>;

  if (participant.members && participant.members.length > 0) {
    const name = participant.members
      .map(
        (m) =>
          m.user?.name ?? m.placeholderParticipant?.displayName ?? "Unknown",
      )
      .join(" & ");
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium">
        {name}
        {!isTeamTournament &&
          (participant.team.color ? (
            <TeamColorBadge
              name={participant.team.name}
              color={participant.team.color}
            />
          ) : (
            <span className="text-muted-foreground text-xs font-normal">
              ({participant.team.name})
            </span>
          ))}
      </span>
    );
  }

  const data: ParticipantData = isTeamTournament
    ? { team: participant.team }
    : {
        user: participant.user,
        placeholderMember: participant.placeholderParticipant,
      };

  return (
    <ParticipantDisplay
      participant={data}
      showAvatar
      size="sm"
      teamName={!isTeamTournament ? participant.team.name : undefined}
      teamColor={!isTeamTournament ? participant.team.color : undefined}
    />
  );
}

export function EditSwissPairingsDialog({
  eventTournamentId,
  round,
  matches,
  isTeamTournament,
  participantMap,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pairings, setPairings] = useState<PairingEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const initPairings = useCallback(() => {
    setPairings(
      matches.map((m) => ({
        matchId: m.id,
        participant1Id: m.participant1Id!,
        participant2Id: m.participant2Id,
        isBye: m.isBye,
      })),
    );
    setSelectedId(null);
  }, [matches]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      initPairings();
    }
    setOpen(newOpen);
  };

  const allParticipantIds = pairings.flatMap((p) =>
    p.participant2Id
      ? [p.participant1Id, p.participant2Id]
      : [p.participant1Id],
  );

  const handleParticipantClick = (participantId: string) => {
    if (selectedId === null) {
      setSelectedId(participantId);
      return;
    }

    if (selectedId === participantId) {
      setSelectedId(null);
      return;
    }

    // Perform the swap
    const newPairings = pairings.map((p) => ({
      ...p,
    }));

    for (const pairing of newPairings) {
      if (pairing.participant1Id === selectedId) {
        pairing.participant1Id = participantId;
      } else if (pairing.participant1Id === participantId) {
        pairing.participant1Id = selectedId;
      }

      if (pairing.participant2Id === selectedId) {
        pairing.participant2Id = participantId;
      } else if (pairing.participant2Id === participantId) {
        pairing.participant2Id = selectedId;
      }
    }

    // Recalculate bye status: if participant2Id is null, it's a bye
    const updatedPairings = newPairings.map((p) => ({
      ...p,
      isBye: p.participant2Id === null,
    }));

    setPairings(updatedPairings);
    setSelectedId(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSwissRoundPairingsAction({
        eventTournamentId,
        round,
        pairings: pairings.map((p) => ({
          matchId: p.matchId,
          participant1Id: p.participant1Id,
          participant2Id: p.participant2Id,
          isBye: p.isBye,
        })),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Pairings updated");
        setOpen(false);
        router.refresh();
      }
    });
  };

  const hasChanges = () => {
    return pairings.some((p, i) => {
      const original = matches[i];
      return (
        p.participant1Id !== original.participant1Id ||
        p.participant2Id !== original.participant2Id
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-1 h-3 w-3" />
          Edit Pairings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Round {round} Pairings</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Click a participant to select them, then click another to swap their
          positions.
        </p>
        <div className="max-h-[60vh] space-y-3 overflow-y-auto">
          {pairings.map((pairing, i) => {
            if (pairing.isBye) {
              const p = participantMap.get(pairing.participant1Id);
              const isSelected = selectedId === pairing.participant1Id;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-dashed p-3"
                >
                  <button
                    type="button"
                    className={`flex-1 cursor-pointer rounded px-2 py-1 text-left transition-colors ${
                      isSelected
                        ? "bg-primary/10 ring-2 ring-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() =>
                      handleParticipantClick(pairing.participant1Id)
                    }
                  >
                    {p ? renderParticipant(p, isTeamTournament) : "Unknown"}
                  </button>
                  <Badge variant="secondary">Bye</Badge>
                </div>
              );
            }

            const p1 = participantMap.get(pairing.participant1Id);
            const p2 = pairing.participant2Id
              ? participantMap.get(pairing.participant2Id)
              : undefined;
            const isP1Selected = selectedId === pairing.participant1Id;
            const isP2Selected = selectedId === pairing.participant2Id;

            return (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border p-3"
              >
                <button
                  type="button"
                  className={`min-w-0 flex-1 cursor-pointer rounded px-2 py-1 text-left transition-colors ${
                    isP1Selected
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => handleParticipantClick(pairing.participant1Id)}
                >
                  {p1 ? renderParticipant(p1, isTeamTournament) : "Unknown"}
                </button>
                <span className="shrink-0 text-sm text-muted-foreground">
                  vs
                </span>
                <button
                  type="button"
                  className={`min-w-0 flex-1 cursor-pointer rounded px-2 py-1 text-left transition-colors ${
                    isP2Selected
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "hover:bg-muted"
                  }`}
                  onClick={() =>
                    pairing.participant2Id &&
                    handleParticipantClick(pairing.participant2Id)
                  }
                >
                  {p2 ? renderParticipant(p2, isTeamTournament) : "Unknown"}
                </button>
              </div>
            );
          })}
        </div>
        {selectedId && (
          <p className="text-sm text-primary">
            Selected:{" "}
            {(() => {
              const p = participantMap.get(selectedId);
              if (!p) return "Unknown";
              if (p.members && p.members.length > 0) {
                return p.members
                  .map(
                    (m) =>
                      m.user?.name ??
                      m.placeholderParticipant?.displayName ??
                      "Unknown",
                  )
                  .join(" & ");
              }
              if (isTeamTournament) return p.team.name;
              return (
                p.user?.name ??
                p.placeholderParticipant?.displayName ??
                "Unknown"
              );
            })()}
            {" — click another participant to swap"}
          </p>
        )}
        {allParticipantIds.length !== new Set(allParticipantIds).size && (
          <p className="text-sm text-destructive">
            Error: duplicate participants detected
          </p>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || !hasChanges()}>
            {isPending ? "Saving..." : "Save Pairings"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
