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
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteDiscretionaryAwardAction } from "../../actions";

interface DeleteDiscretionaryDialogProps {
  awardId: string;
  awardName: string;
  redirectTo?: string;
}

export function DeleteDiscretionaryDialog({
  awardId,
  awardName,
  redirectTo,
}: DeleteDiscretionaryDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteDiscretionaryAwardAction({ awardId });

      if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        toast.success("Award deleted.");
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.refresh();
        }
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Discretionary Award</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{awardName}&rdquo;? All
            associated points will be removed from the leaderboard. This cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Award"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
