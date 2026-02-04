import { type DBOrTx, db, withTransaction } from "@/db/index";
import { acceptAllPendingInvitationsForLeague } from "@/db/invitations";
import { createLeagueMember, getLeagueMember } from "@/db/league-members";
import {
  canLeagueAddMember,
  canUserJoinAnotherLeague,
} from "@/lib/server/limits";
import { LeagueMemberRole } from "@/lib/shared/constants";

import { linkPlaceholderToUser } from "./placeholder-members";
import { ServiceResult } from "./shared";

/**
 * Core logic for adding a user to a league.
 * Handles limit checks, membership creation, invitation cleanup, and optional placeholder linking.
 *
 * Callers should validate league-specific requirements (exists, not archived,
 * visibility, invitation validity) before calling this function.
 *
 * @param placeholderId - Optional placeholder to link to the user, migrating their history
 */
export async function addUserToLeague(
  userId: string,
  leagueId: string,
  role: LeagueMemberRole,
  placeholderId?: string,
  dbOrTx: DBOrTx = db,
): Promise<ServiceResult<{ joined: boolean }>> {
  const existingMembership = await getLeagueMember(userId, leagueId);
  if (existingMembership) {
    return { error: "You are already a member of this league" };
  }

  const userLimitCheck = await canUserJoinAnotherLeague(userId);
  if (!userLimitCheck.allowed) {
    return { error: userLimitCheck.message };
  }

  const leagueLimitCheck = await canLeagueAddMember(leagueId);
  if (!leagueLimitCheck.allowed) {
    return { error: leagueLimitCheck.message };
  }

  const processJoin = async (tx: DBOrTx) => {
    await createLeagueMember({ userId, leagueId, role }, tx);
    await acceptAllPendingInvitationsForLeague(leagueId, userId, tx);

    if (placeholderId) {
      const linkResult = await linkPlaceholderToUser(
        placeholderId,
        userId,
        leagueId,
        tx,
      );
      if (linkResult.error) {
        throw new Error(linkResult.error);
      }
    }

    return { data: { joined: true } };
  };

  if (dbOrTx === db) {
    return withTransaction(processJoin);
  }
  return processJoin(dbOrTx);
}
