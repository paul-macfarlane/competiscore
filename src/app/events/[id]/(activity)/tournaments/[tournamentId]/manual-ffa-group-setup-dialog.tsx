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
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { manualFFAGroupSetupAction } from "../../../actions";

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

type Props = {
  tournamentId: string;
  participants: TournamentParticipant[];
  groupCount: number;
  groupSize: number;
  advanceCount: number;
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

export function ManualFFAGroupSetupDialog({
  tournamentId,
  participants,
  groupCount,
  groupSize,
  advanceCount,
  isTeamTournament,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [groupAssignments, setGroupAssignments] = useState<
    Map<number, string[]>
  >(new Map());
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

  const assignedIds = useMemo(() => {
    const set = new Set<string>();
    for (const ids of groupAssignments.values()) {
      for (const id of ids) set.add(id);
    }
    return set;
  }, [groupAssignments]);

  const unassignedParticipants = useMemo(
    () => participants.filter((p) => !assignedIds.has(p.id)),
    [participants, assignedIds],
  );

  const allAssigned = unassignedParticipants.length === 0;

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      const map = new Map<number, string[]>();
      for (let i = 0; i < groupCount; i++) {
        map.set(i, []);
      }
      setGroupAssignments(map);
      setSelectedParticipantId(null);
    }
    setOpen(newOpen);
  };

  const findGroupForParticipant = (pid: string): number | null => {
    for (const [groupIdx, ids] of groupAssignments) {
      if (ids.includes(pid)) return groupIdx;
    }
    return null;
  };

  const handleUnassignedClick = (pid: string) => {
    if (selectedParticipantId === pid) {
      setSelectedParticipantId(null);
      return;
    }

    if (selectedParticipantId !== null) {
      const selectedGroup = findGroupForParticipant(selectedParticipantId);
      if (selectedGroup !== null) {
        // Selected is assigned, clicked is unassigned — swap them
        const newAssignments = new Map(groupAssignments);
        const groupIds = [...(newAssignments.get(selectedGroup) ?? [])];
        const idx = groupIds.indexOf(selectedParticipantId);
        groupIds[idx] = pid;
        newAssignments.set(selectedGroup, groupIds);
        setGroupAssignments(newAssignments);
        setSelectedParticipantId(null);
        return;
      }
    }

    setSelectedParticipantId(pid);
  };

  const handleAssignedClick = (pid: string, groupIdx: number) => {
    if (selectedParticipantId === pid) {
      // Remove from group back to pool
      const newAssignments = new Map(groupAssignments);
      const groupIds = (newAssignments.get(groupIdx) ?? []).filter(
        (id) => id !== pid,
      );
      newAssignments.set(groupIdx, groupIds);
      setGroupAssignments(newAssignments);
      setSelectedParticipantId(null);
      return;
    }

    if (selectedParticipantId !== null) {
      const selectedGroup = findGroupForParticipant(selectedParticipantId);
      const newAssignments = new Map(groupAssignments);

      if (selectedGroup !== null) {
        // Both assigned — swap
        const group1Ids = [...(newAssignments.get(selectedGroup) ?? [])];
        const group2Ids = [...(newAssignments.get(groupIdx) ?? [])];
        const idx1 = group1Ids.indexOf(selectedParticipantId);
        const idx2 = group2Ids.indexOf(pid);

        if (selectedGroup === groupIdx) {
          [group1Ids[idx1], group1Ids[idx2]] = [
            group1Ids[idx2],
            group1Ids[idx1],
          ];
          newAssignments.set(groupIdx, group1Ids);
        } else {
          group1Ids[idx1] = pid;
          group2Ids[idx2] = selectedParticipantId;
          newAssignments.set(selectedGroup, group1Ids);
          newAssignments.set(groupIdx, group2Ids);
        }
      } else {
        // Selected is unassigned, clicked is assigned — swap
        const groupIds = [...(newAssignments.get(groupIdx) ?? [])];
        const idx = groupIds.indexOf(pid);
        groupIds[idx] = selectedParticipantId;
        newAssignments.set(groupIdx, groupIds);
      }

      setGroupAssignments(newAssignments);
      setSelectedParticipantId(null);
      return;
    }

    setSelectedParticipantId(pid);
  };

  const handleEmptySlotClick = (groupIdx: number) => {
    if (selectedParticipantId === null) return;

    const selectedGroup = findGroupForParticipant(selectedParticipantId);
    const newAssignments = new Map(groupAssignments);

    if (selectedGroup !== null) {
      // Move from one group to another
      const fromIds = (newAssignments.get(selectedGroup) ?? []).filter(
        (id) => id !== selectedParticipantId,
      );
      newAssignments.set(selectedGroup, fromIds);
    }

    const toIds = [
      ...(newAssignments.get(groupIdx) ?? []),
      selectedParticipantId,
    ];
    newAssignments.set(groupIdx, toIds);
    setGroupAssignments(newAssignments);
    setSelectedParticipantId(null);
  };

  const handleSave = () => {
    startTransition(async () => {
      const groups = Array.from(groupAssignments.entries())
        .sort(([a], [b]) => a - b)
        .map(([, participantIds]) => ({ participantIds }));

      const result = await manualFFAGroupSetupAction({
        eventTournamentId: tournamentId,
        groups,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Tournament started with manual groups!");
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
          <DialogTitle>Manual Group Setup</DialogTitle>
          <DialogDescription>
            Assign participants to groups manually. Click a participant to
            select, then click a group slot to assign them.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          <div className="rounded-lg border p-3">
            <h4 className="mb-2 text-sm font-medium">
              Unassigned ({unassignedParticipants.length} remaining)
            </h4>
            {unassignedParticipants.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {unassignedParticipants.map((p) => {
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
                      onClick={() => handleUnassignedClick(p.id)}
                    >
                      {renderParticipant(p, isTeamTournament)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                All participants assigned
              </p>
            )}
          </div>

          {Array.from(groupAssignments.entries())
            .sort(([a], [b]) => a - b)
            .map(([groupIdx, pIds]) => {
              const emptySlots = Math.max(0, groupSize - pIds.length);
              return (
                <div key={groupIdx} className="rounded-lg border p-3">
                  <h4 className="mb-2 text-sm font-medium">
                    Group {groupIdx + 1} ({pIds.length}/{groupSize})
                    {advanceCount > 0 && (
                      <span className="ml-1 text-muted-foreground font-normal">
                        — top {advanceCount} advance
                      </span>
                    )}
                  </h4>
                  <div className="space-y-1">
                    {pIds.map((pid) => {
                      const p = participantMap.get(pid);
                      if (!p) return null;
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
                          onClick={() => handleAssignedClick(pid, groupIdx)}
                        >
                          {renderParticipant(p, isTeamTournament)}
                        </button>
                      );
                    })}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <button
                        key={`empty-${i}`}
                        type="button"
                        className={`w-full cursor-pointer rounded border border-dashed px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors ${
                          selectedParticipantId
                            ? "hover:border-primary hover:bg-primary/5"
                            : ""
                        }`}
                        onClick={() => handleEmptySlotClick(groupIdx)}
                        disabled={!selectedParticipantId}
                      >
                        Empty slot
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
        {selectedParticipantId &&
          (() => {
            const p = participantMap.get(selectedParticipantId);
            if (!p) return null;
            return (
              <p className="text-sm text-primary">
                Selected: {getParticipantName(p, isTeamTournament)} — click a
                group slot to assign or another participant to swap
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
          <Button onClick={handleSave} disabled={isPending || !allAssigned}>
            {isPending ? "Starting..." : "Start Tournament"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
