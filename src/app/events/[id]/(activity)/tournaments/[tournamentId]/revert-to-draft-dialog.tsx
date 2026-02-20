"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { revertEventTournamentToDraftAction } from "../../../actions";

interface RevertToDraftDialogProps {
  tournamentId: string;
}

export function RevertToDraftDialog({
  tournamentId,
}: RevertToDraftDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRevert = () => {
    startTransition(async () => {
      const result = await revertEventTournamentToDraftAction({
        eventTournamentId: tournamentId,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Tournament reverted to draft");
        router.refresh();
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          <RotateCcw className="mr-1 h-3 w-3" />
          Revert to Draft
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revert tournament to draft?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the bracket, reset seeds, and return the tournament
            to draft. You can then add or remove participants and regenerate the
            bracket.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRevert} disabled={isPending}>
            {isPending ? "Reverting..." : "Revert to Draft"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
