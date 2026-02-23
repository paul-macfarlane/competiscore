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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateFFAGroupAssignmentsAction } from "../../../actions";

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
  round: number;
  groups: Group[];
  isTeamTournament: boolean;
};

function getParticipantName(
  gp: GroupParticipant,
  isTeamTournament: boolean,
): string {
  const tp = gp.tournamentParticipant;
  if (tp.members && tp.members.length > 0) {
    return tp.members
      .map(
        (m) =>
          m.user?.name ?? m.placeholderParticipant?.displayName ?? "Unknown",
      )
      .join(" & ");
  }
  if (isTeamTournament) return tp.team.name;
  return tp.user?.name ?? tp.placeholderParticipant?.displayName ?? "Unknown";
}

function renderParticipant(gp: GroupParticipant, isTeamTournament: boolean) {
  const tp = gp.tournamentParticipant;

  if (tp.members && tp.members.length > 0) {
    const name = tp.members
      .map(
        (m) =>
          m.user?.name ?? m.placeholderParticipant?.displayName ?? "Unknown",
      )
      .join(" & ");
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium">
        {name}
        {!isTeamTournament &&
          (tp.team.color ? (
            <TeamColorBadge name={tp.team.name} color={tp.team.color} />
          ) : (
            <span className="text-muted-foreground text-xs font-normal">
              ({tp.team.name})
            </span>
          ))}
      </span>
    );
  }

  const data: ParticipantData = isTeamTournament
    ? { team: tp.team }
    : {
        user: tp.user,
        placeholderMember: tp.placeholderParticipant,
      };

  return (
    <ParticipantDisplay
      participant={data}
      showAvatar
      size="sm"
      teamName={!isTeamTournament ? tp.team.name : undefined}
      teamColor={!isTeamTournament ? tp.team.color : undefined}
    />
  );
}

export function EditFFAGroupsDialog({
  eventTournamentId,
  round,
  groups,
  isTeamTournament,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [groupAssignments, setGroupAssignments] = useState<
    Map<string, string[]>
  >(new Map());
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);

  const participantMap = useMemo(() => {
    const map = new Map<string, GroupParticipant>();
    for (const group of groups) {
      for (const gp of group.participants) {
        map.set(gp.eventTournamentParticipantId, gp);
      }
    }
    return map;
  }, [groups]);

  const initAssignments = useCallback(() => {
    const map = new Map<string, string[]>();
    for (const group of groups) {
      map.set(
        group.id,
        group.participants.map((gp) => gp.eventTournamentParticipantId),
      );
    }
    setGroupAssignments(map);
    setSelectedParticipantId(null);
  }, [groups]);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      initAssignments();
    }
    setOpen(newOpen);
  };

  const handleParticipantClick = (participantId: string) => {
    if (selectedParticipantId === null) {
      setSelectedParticipantId(participantId);
      return;
    }

    if (selectedParticipantId === participantId) {
      setSelectedParticipantId(null);
      return;
    }

    const newAssignments = new Map<string, string[]>();
    for (const [groupId, pIds] of groupAssignments) {
      newAssignments.set(
        groupId,
        pIds.map((id) => {
          if (id === selectedParticipantId) return participantId;
          if (id === participantId) return selectedParticipantId;
          return id;
        }),
      );
    }

    setGroupAssignments(newAssignments);
    setSelectedParticipantId(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      const groupsPayload = Array.from(groupAssignments.entries()).map(
        ([groupId, participantIds]) => ({
          groupId,
          participantIds,
        }),
      );

      const result = await updateFFAGroupAssignmentsAction({
        eventTournamentId,
        round,
        groups: groupsPayload,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Group assignments updated");
        setOpen(false);
        router.refresh();
      }
    });
  };

  const hasChanges = () => {
    for (const group of groups) {
      const newPIds = groupAssignments.get(group.id);
      if (!newPIds) return false;
      const origPIds = group.participants.map(
        (gp) => gp.eventTournamentParticipantId,
      );
      if (origPIds.length !== newPIds.length) return true;
      for (let i = 0; i < origPIds.length; i++) {
        if (origPIds[i] !== newPIds[i]) return true;
      }
    }
    return false;
  };

  const allParticipantIds = Array.from(groupAssignments.values()).flat();
  const hasDuplicates =
    allParticipantIds.length !== new Set(allParticipantIds).size;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-1 h-3 w-3" />
          Edit Groups
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Round {round} Groups</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Click a participant to select them, then click another to swap their
          positions.
        </p>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {groups.map((group) => {
            const pIds = groupAssignments.get(group.id) ?? [];
            return (
              <div key={group.id} className="rounded-lg border p-3">
                <h4 className="mb-2 text-sm font-medium">
                  Group {group.position}
                </h4>
                <div className="space-y-1">
                  {pIds.map((pid) => {
                    const gp = participantMap.get(pid);
                    if (!gp) return null;
                    const isSelected = selectedParticipantId === pid;
                    return (
                      <button
                        key={pid}
                        type="button"
                        className={`w-full cursor-pointer rounded px-2 py-1.5 text-left transition-colors ${
                          isSelected
                            ? "bg-primary/10 ring-2 ring-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleParticipantClick(pid)}
                      >
                        {renderParticipant(gp, isTeamTournament)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {selectedParticipantId &&
          (() => {
            const gp = participantMap.get(selectedParticipantId);
            if (!gp) return null;
            return (
              <p className="text-sm text-primary">
                Selected: {getParticipantName(gp, isTeamTournament)} — click
                another participant to swap
              </p>
            );
          })()}
        {hasDuplicates && (
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
          <Button
            onClick={handleSave}
            disabled={isPending || !hasChanges() || hasDuplicates}
          >
            {isPending ? "Saving..." : "Save Groups"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
