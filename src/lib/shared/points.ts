import type { PointEntryWithParticipantLinks } from "@/db/events";

type MatchParticipantForPoints = {
  id: string;
  userId: string | null;
  eventPlaceholderParticipantId: string | null;
  eventTeamId: string | null;
  members?: {
    user: { id: string } | null;
    placeholderParticipant: { id: string } | null;
  }[];
};

/**
 * Maps each match participant to their individual points from point entries.
 * Uses eventPointEntryParticipant links to correctly attribute points
 * when multiple participants share the same team.
 */
export function computePointsByParticipant(
  pointEntries: PointEntryWithParticipantLinks[],
  participants: MatchParticipantForPoints[],
): Map<string, number> {
  const result = new Map<string, number>();

  for (const pe of pointEntries) {
    if (pe.entryParticipants.length > 0) {
      const entryUserIds = new Set(
        pe.entryParticipants
          .map((ep) => ep.userId)
          .filter((id): id is string => id !== null),
      );
      const entryPlaceholderIds = new Set(
        pe.entryParticipants
          .map((ep) => ep.eventPlaceholderParticipantId)
          .filter((id): id is string => id !== null),
      );

      for (const p of participants) {
        if (
          (p.userId && entryUserIds.has(p.userId)) ||
          (p.eventPlaceholderParticipantId &&
            entryPlaceholderIds.has(p.eventPlaceholderParticipantId)) ||
          p.members?.some(
            (m) =>
              (m.user?.id && entryUserIds.has(m.user.id)) ||
              (m.placeholderParticipant?.id &&
                entryPlaceholderIds.has(m.placeholderParticipant.id)),
          )
        ) {
          result.set(p.id, (result.get(p.id) ?? 0) + pe.points);
          break;
        }
      }
    } else if (pe.eventTeamId) {
      // Team-based fallback (team FFA where no individual participants tracked)
      for (const p of participants) {
        if (p.eventTeamId === pe.eventTeamId) {
          result.set(p.id, (result.get(p.id) ?? 0) + pe.points);
        }
      }
    }
  }

  return result;
}
