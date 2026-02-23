"use client";

import {
  ParticipantData,
  ParticipantDisplay,
} from "@/components/participant-display";
import { TeamColorBadge } from "@/components/team-color-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { manualSwissRound1SetupAction } from "../../../actions";

type ParticipantMember = {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  } | null;
  placeholderParticipant: { id: string; displayName: string } | null;
};

type TournamentParticipant = {
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
  members?: ParticipantMember[];
};

type Pairing = {
  participant1Id: string;
  participant2Id: string | null;
  isBye: boolean;
};

type Props = {
  tournamentId: string;
  participants: TournamentParticipant[];
  isTeamTournament: boolean;
};

function getParticipantName(
  p: TournamentParticipant,
  isTeamTournament: boolean,
): string {
  if (p.members && p.members.length > 0) {
    return p.members
      .map(
        (m) =>
          m.user?.name ?? m.placeholderParticipant?.displayName ?? "Unknown",
      )
      .join(" & ");
  }
  if (isTeamTournament) return p.team.name;
  return p.user?.name ?? p.placeholderParticipant?.displayName ?? "Unknown";
}

function renderParticipant(
  p: TournamentParticipant,
  isTeamTournament: boolean,
) {
  if (p.members && p.members.length > 0) {
    const name = p.members
      .map(
        (m) =>
          m.user?.name ?? m.placeholderParticipant?.displayName ?? "Unknown",
      )
      .join(" & ");
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium">
        {name}
        {!isTeamTournament &&
          (p.team.color ? (
            <TeamColorBadge name={p.team.name} color={p.team.color} />
          ) : (
            <span className="text-muted-foreground text-xs font-normal">
              ({p.team.name})
            </span>
          ))}
      </span>
    );
  }

  const data: ParticipantData = isTeamTournament
    ? { team: p.team }
    : {
        user: p.user,
        placeholderMember: p.placeholderParticipant,
      };

  return (
    <ParticipantDisplay
      participant={data}
      showAvatar
      size="sm"
      teamName={!isTeamTournament ? p.team.name : undefined}
      teamColor={!isTeamTournament ? p.team.color : undefined}
    />
  );
}

export function ManualSwissPairingSetupDialog({
  tournamentId,
  participants,
  isTeamTournament,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);

  const participantMap = useMemo(() => {
    const map = new Map<string, TournamentParticipant>();
    for (const p of participants) {
      map.set(p.id, p);
    }
    return map;
  }, [participants]);

  const pairedIds = useMemo(() => {
    const set = new Set<string>();
    for (const pairing of pairings) {
      set.add(pairing.participant1Id);
      if (pairing.participant2Id) set.add(pairing.participant2Id);
    }
    return set;
  }, [pairings]);

  const unpairedParticipants = useMemo(
    () => participants.filter((p) => !pairedIds.has(p.id)),
    [participants, pairedIds],
  );

  const allPaired = unpairedParticipants.length === 0;
  const isOddCount = participants.length % 2 === 1;
  const hasBye = pairings.some((p) => p.isBye);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setPairings([]);
      setSelectedParticipantId(null);
    }
    setOpen(newOpen);
  };

  const handleParticipantClick = (pid: string) => {
    if (selectedParticipantId === pid) {
      setSelectedParticipantId(null);
      return;
    }

    if (selectedParticipantId !== null) {
      // Pair the two selected participants
      setPairings([
        ...pairings,
        {
          participant1Id: selectedParticipantId,
          participant2Id: pid,
          isBye: false,
        },
      ]);
      setSelectedParticipantId(null);
      return;
    }

    setSelectedParticipantId(pid);
  };

  const handleAssignBye = () => {
    if (selectedParticipantId === null) return;
    setPairings([
      ...pairings,
      {
        participant1Id: selectedParticipantId,
        participant2Id: null,
        isBye: true,
      },
    ]);
    setSelectedParticipantId(null);
  };

  const handleRemovePairing = (index: number) => {
    setPairings(pairings.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await manualSwissRound1SetupAction({
        eventTournamentId: tournamentId,
        pairings,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Tournament started with manual pairings!");
        setOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="mr-1 h-4 w-4" />
          Manual Setup
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manual Round 1 Pairings</DialogTitle>
          <DialogDescription>
            Select two participants to pair them. Click a participant to select,
            then click another to create a pairing.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          <div className="rounded-lg border p-3">
            <h4 className="mb-2 text-sm font-medium">
              Unpaired ({unpairedParticipants.length} remaining)
            </h4>
            {unpairedParticipants.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {unpairedParticipants.map((p) => {
                  const isSelected = selectedParticipantId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`cursor-pointer rounded px-2 py-1.5 text-left transition-colors ${
                        isSelected
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleParticipantClick(p.id)}
                    >
                      {renderParticipant(p, isTeamTournament)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                All participants paired
              </p>
            )}
            {selectedParticipantId &&
              !pairedIds.has(selectedParticipantId) &&
              isOddCount &&
              !hasBye && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleAssignBye}
                >
                  Assign Bye
                </Button>
              )}
          </div>

          {pairings.length > 0 && (
            <div className="rounded-lg border p-3">
              <h4 className="mb-2 text-sm font-medium">
                Pairings ({pairings.length})
              </h4>
              <div className="space-y-2">
                {pairings.map((pairing, i) => {
                  const p1 = participantMap.get(pairing.participant1Id);
                  const p2 = pairing.participant2Id
                    ? participantMap.get(pairing.participant2Id)
                    : null;
                  if (!p1) return null;
                  return (
                    <div
                      key={`${pairing.participant1Id}-${pairing.participant2Id ?? "bye"}`}
                      className="flex items-center justify-between rounded bg-muted/50 px-2 py-1.5"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        {pairing.isBye ? (
                          <span>
                            {renderParticipant(p1, isTeamTournament)}{" "}
                            <span className="text-muted-foreground">(Bye)</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            {renderParticipant(p1, isTeamTournament)}
                            <span className="text-muted-foreground">vs</span>
                            {p2 && renderParticipant(p2, isTeamTournament)}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemovePairing(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {selectedParticipantId &&
          (() => {
            const p = participantMap.get(selectedParticipantId);
            if (!p) return null;
            return (
              <p className="text-sm text-primary">
                Selected: {getParticipantName(p, isTeamTournament)} — click
                another participant to pair
              </p>
            );
          })()}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || !allPaired}>
            {isPending ? "Starting..." : "Start Tournament"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
