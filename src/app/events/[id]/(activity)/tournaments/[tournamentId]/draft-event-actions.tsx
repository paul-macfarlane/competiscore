"use client";

import { Button } from "@/components/ui/button";
import { Brackets } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { generateEventBracketAction } from "../../../actions";

type Props = {
  tournamentId: string;
  participantCount: number;
  isFFAGroupStage?: boolean;
};

export function DraftEventActions({
  tournamentId,
  participantCount,
  isFFAGroupStage,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const label = isFFAGroupStage ? "Generate Groups" : "Generate Bracket";
  const successMessage = isFFAGroupStage
    ? "Groups generated!"
    : "Bracket generated!";

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generateEventBracketAction({
        eventTournamentId: tournamentId,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(successMessage);
        router.refresh();
      }
    });
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={isPending || participantCount < 2}
    >
      <Brackets className="mr-1 h-4 w-4" />
      {isPending ? "Generating..." : label}
    </Button>
  );
}
