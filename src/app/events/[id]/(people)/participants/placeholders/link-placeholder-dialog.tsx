"use client";

import {
  ParticipantData,
  ParticipantDisplay,
} from "@/components/participant-display";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventParticipantWithUser } from "@/db/events";
import { EventPlaceholderParticipant } from "@/db/schema";
import { Check } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { linkEventPlaceholderAction } from "./actions";

interface LinkPlaceholderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder: EventPlaceholderParticipant;
  eventId: string;
  linkableParticipants: EventParticipantWithUser[];
}

export function LinkPlaceholderDialog({
  open,
  onOpenChange,
  placeholder,
  eventId,
  linkableParticipants,
}: LinkPlaceholderDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (!search.trim()) return linkableParticipants;
    const lower = search.toLowerCase();
    return linkableParticipants.filter(
      (p) =>
        p.user.name.toLowerCase().includes(lower) ||
        (p.user.username && p.user.username.toLowerCase().includes(lower)),
    );
  }, [linkableParticipants, search]);

  const handleConfirm = () => {
    if (!selectedUserId) return;
    startTransition(async () => {
      const result = await linkEventPlaceholderAction({
        placeholderId: placeholder.id,
        eventId,
        targetUserId: selectedUserId,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Linked ${placeholder.displayName} to user successfully`);
        onOpenChange(false);
        setSelectedUserId(null);
        setSearch("");
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setSelectedUserId(null);
          setSearch("");
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Link Placeholder to User</DialogTitle>
          <DialogDescription>
            Link <strong>{placeholder.displayName}</strong> to a real user. All
            match history, scores, and tournament data will be migrated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Search participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ScrollArea className="h-64">
            <div className="space-y-1 pr-3">
              {filtered.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No linkable participants found.
                </p>
              ) : (
                filtered.map((participant) => {
                  const isSelected = selectedUserId === participant.userId;
                  const participantData: ParticipantData = {
                    user: participant.user,
                  };
                  return (
                    <button
                      key={participant.userId}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-muted"
                      }`}
                      onClick={() => setSelectedUserId(participant.userId)}
                    >
                      <ParticipantDisplay
                        participant={participantData}
                        showAvatar
                        showUsername
                        size="sm"
                      />
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedUserId || isPending}
          >
            {isPending ? "Linking..." : "Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
