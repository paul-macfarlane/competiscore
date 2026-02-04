import { LeagueVisibility } from "@/lib/shared/constants";
import { and, count, eq, ilike, or } from "drizzle-orm";

import { DBOrTx, db } from "./index";
import {
  League,
  NewLeague,
  gameType,
  league,
  leagueColumns,
  leagueMember,
} from "./schema";

export async function createLeague(
  data: Omit<NewLeague, "id" | "createdAt" | "updatedAt">,
  dbOrTx: DBOrTx = db,
): Promise<League> {
  const result = await dbOrTx.insert(league).values(data).returning();
  return result[0];
}

export async function getLeagueById(
  id: string,
  dbOrTx: DBOrTx = db,
): Promise<League | undefined> {
  const result = await dbOrTx
    .select()
    .from(league)
    .where(eq(league.id, id))
    .limit(1);
  return result[0];
}

export async function updateLeague(
  id: string,
  data: Partial<Pick<League, "name" | "description" | "visibility" | "logo">>,
  dbOrTx: DBOrTx = db,
): Promise<League | undefined> {
  const result = await dbOrTx
    .update(league)
    .set(data)
    .where(eq(league.id, id))
    .returning();
  return result[0];
}

export async function archiveLeague(
  id: string,
  dbOrTx: DBOrTx = db,
): Promise<League | undefined> {
  const result = await dbOrTx
    .update(league)
    .set({ isArchived: true })
    .where(eq(league.id, id))
    .returning();
  return result[0];
}

export async function unarchiveLeague(
  id: string,
  dbOrTx: DBOrTx = db,
): Promise<League | undefined> {
  const result = await dbOrTx
    .update(league)
    .set({ isArchived: false })
    .where(eq(league.id, id))
    .returning();
  return result[0];
}

export async function deleteLeague(
  id: string,
  dbOrTx: DBOrTx = db,
): Promise<boolean> {
  const result = await dbOrTx.delete(league).where(eq(league.id, id));
  return result.rowCount !== null && result.rowCount > 0;
}

export async function searchPublicLeagues(
  query: string,
  gameTypeFilter?: string,
  dbOrTx: DBOrTx = db,
): Promise<Array<League & { memberCount: number }>> {
  let queryBuilder = dbOrTx
    .select({
      ...leagueColumns,
      memberCount: count(leagueMember.id),
    })
    .from(league)
    .leftJoin(leagueMember, eq(league.id, leagueMember.leagueId));

  if (gameTypeFilter) {
    queryBuilder = queryBuilder.innerJoin(
      gameType,
      and(
        eq(league.id, gameType.leagueId),
        eq(gameType.isArchived, false),
        ilike(gameType.name, `%${gameTypeFilter}%`),
      ),
    );
  }

  const whereConditions = [
    eq(league.visibility, LeagueVisibility.PUBLIC),
    eq(league.isArchived, false),
  ];

  if (query && query.length > 0) {
    const searchPattern = `%${query}%`;
    whereConditions.push(
      or(
        ilike(league.name, searchPattern),
        ilike(league.description, searchPattern),
      )!,
    );
  }

  const results = await queryBuilder
    .where(and(...whereConditions))
    .groupBy(league.id)
    .limit(20);

  return results;
}

export async function getLeagueGameTypesForSearch(
  leagueId: string,
  gameTypeFilter?: string,
  dbOrTx: DBOrTx = db,
): Promise<Array<{ id: string; name: string; isMatch: boolean }>> {
  const allGameTypes = await dbOrTx
    .select({
      id: gameType.id,
      name: gameType.name,
    })
    .from(gameType)
    .where(and(eq(gameType.leagueId, leagueId), eq(gameType.isArchived, false)))
    .limit(10);

  if (!gameTypeFilter) {
    return allGameTypes.slice(0, 3).map((gt) => ({ ...gt, isMatch: false }));
  }

  const filterLower = gameTypeFilter.toLowerCase();
  const matching: Array<{ id: string; name: string; isMatch: boolean }> = [];
  const nonMatching: Array<{ id: string; name: string; isMatch: boolean }> = [];

  for (const gt of allGameTypes) {
    if (gt.name.toLowerCase().includes(filterLower)) {
      matching.push({ ...gt, isMatch: true });
    } else {
      nonMatching.push({ ...gt, isMatch: false });
    }
  }

  return [...matching, ...nonMatching].slice(0, 3);
}

export async function getLeagueWithMemberCount(
  id: string,
  dbOrTx: DBOrTx = db,
): Promise<(League & { memberCount: number }) | undefined> {
  const results = await dbOrTx
    .select({
      ...leagueColumns,
      memberCount: count(leagueMember.id),
    })
    .from(league)
    .leftJoin(leagueMember, eq(league.id, leagueMember.leagueId))
    .where(eq(league.id, id))
    .groupBy(league.id)
    .limit(1);

  return results[0];
}
