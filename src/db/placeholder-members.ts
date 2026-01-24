import { and, eq, isNotNull, isNull } from "drizzle-orm";

import { DBOrTx, db } from "./index";
import {
  NewPlaceholderMember,
  PlaceholderMember,
  placeholderMember,
} from "./schema";

export async function createPlaceholderMember(
  data: Omit<NewPlaceholderMember, "id" | "createdAt">,
  dbOrTx: DBOrTx = db,
): Promise<PlaceholderMember> {
  const result = await dbOrTx
    .insert(placeholderMember)
    .values(data)
    .returning();
  return result[0];
}

export async function getPlaceholderMemberById(
  id: string,
  dbOrTx: DBOrTx = db,
): Promise<PlaceholderMember | undefined> {
  const result = await dbOrTx
    .select()
    .from(placeholderMember)
    .where(eq(placeholderMember.id, id))
    .limit(1);
  return result[0];
}

export async function getActivePlaceholderMembersByLeague(
  leagueId: string,
  dbOrTx: DBOrTx = db,
): Promise<PlaceholderMember[]> {
  const results = await dbOrTx
    .select()
    .from(placeholderMember)
    .where(
      and(
        eq(placeholderMember.leagueId, leagueId),
        isNull(placeholderMember.retiredAt),
      ),
    )
    .orderBy(placeholderMember.createdAt);

  return results;
}

export async function updatePlaceholderMember(
  id: string,
  data: Partial<Pick<PlaceholderMember, "displayName" | "linkedUserId">>,
  dbOrTx: DBOrTx = db,
): Promise<PlaceholderMember | undefined> {
  const result = await dbOrTx
    .update(placeholderMember)
    .set(data)
    .where(eq(placeholderMember.id, id))
    .returning();
  return result[0];
}

export async function getRetiredPlaceholderMembersByLeague(
  leagueId: string,
  dbOrTx: DBOrTx = db,
): Promise<PlaceholderMember[]> {
  const results = await dbOrTx
    .select()
    .from(placeholderMember)
    .where(
      and(
        eq(placeholderMember.leagueId, leagueId),
        isNotNull(placeholderMember.retiredAt),
      ),
    )
    .orderBy(placeholderMember.createdAt);

  return results;
}

export async function retirePlaceholderMember(
  id: string,
  dbOrTx: DBOrTx = db,
): Promise<PlaceholderMember | undefined> {
  const result = await dbOrTx
    .update(placeholderMember)
    .set({ retiredAt: new Date() })
    .where(eq(placeholderMember.id, id))
    .returning();
  return result[0];
}

export async function restorePlaceholderMember(
  id: string,
  dbOrTx: DBOrTx = db,
): Promise<PlaceholderMember | undefined> {
  const result = await dbOrTx
    .update(placeholderMember)
    .set({ retiredAt: null })
    .where(eq(placeholderMember.id, id))
    .returning();
  return result[0];
}
