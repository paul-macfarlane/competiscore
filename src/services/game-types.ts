import {
  archiveGameType as dbArchiveGameType,
  checkGameTypeNameExists as dbCheckGameTypeNameExists,
  createGameType as dbCreateGameType,
  deleteGameType as dbDeleteGameType,
  getGameTypeById as dbGetGameTypeById,
  getGameTypesByLeagueId as dbGetGameTypesByLeagueId,
  unarchiveGameType as dbUnarchiveGameType,
  updateGameType as dbUpdateGameType,
} from "@/db/game-types";
import { getLeagueMember } from "@/db/league-members";
import { GameType } from "@/db/schema";
import { canLeagueAddGameType } from "@/lib/server/limits";
import { LeagueAction, canPerformAction } from "@/lib/shared/permissions";
import {
  createGameTypeFormSchema,
  updateGameTypeFormSchema,
} from "@/validators/game-types";

import { ServiceResult, formatZodErrors } from "./shared";

export async function createGameType(
  userId: string,
  leagueId: string,
  input: unknown,
): Promise<ServiceResult<GameType>> {
  const membership = await getLeagueMember(userId, leagueId);
  if (!membership) {
    return { error: "You are not a member of this league" };
  }

  if (!canPerformAction(membership.role, LeagueAction.CREATE_GAME_TYPES)) {
    return { error: "You do not have permission to create game types" };
  }

  const parsed = createGameTypeFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Validation failed",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }

  const nameExists = await dbCheckGameTypeNameExists(
    leagueId,
    parsed.data.name,
  );
  if (nameExists) {
    return {
      error: "Validation failed",
      fieldErrors: { name: "A game type with this name already exists" },
    };
  }

  const limitCheck = await canLeagueAddGameType(leagueId);
  if (!limitCheck.allowed) {
    return { error: limitCheck.message };
  }

  const gameType = await dbCreateGameType({
    leagueId,
    name: parsed.data.name,
    description: parsed.data.description || null,
    logo: parsed.data.logo || null,
    category: parsed.data.category,
    config: JSON.stringify(parsed.data.config),
  });

  return { data: gameType };
}

export async function getGameType(
  userId: string,
  gameTypeId: string,
): Promise<ServiceResult<GameType>> {
  const gameType = await dbGetGameTypeById(gameTypeId);
  if (!gameType) {
    return { error: "Game type not found" };
  }

  const membership = await getLeagueMember(userId, gameType.leagueId);
  if (!membership) {
    return { error: "You are not a member of this league" };
  }

  return { data: gameType };
}

export async function getLeagueGameTypes(
  userId: string,
  leagueId: string,
): Promise<ServiceResult<GameType[]>> {
  const membership = await getLeagueMember(userId, leagueId);
  if (!membership) {
    return { error: "You are not a member of this league" };
  }

  const gameTypes = await dbGetGameTypesByLeagueId(leagueId);
  return { data: gameTypes };
}

export async function updateGameType(
  userId: string,
  gameTypeId: string,
  input: unknown,
): Promise<ServiceResult<GameType>> {
  const gameType = await dbGetGameTypeById(gameTypeId);
  if (!gameType) {
    return { error: "Game type not found" };
  }

  const membership = await getLeagueMember(userId, gameType.leagueId);
  if (!membership) {
    return { error: "You are not a member of this league" };
  }

  if (!canPerformAction(membership.role, LeagueAction.CREATE_GAME_TYPES)) {
    return { error: "You do not have permission to edit game types" };
  }

  const parsed = updateGameTypeFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Validation failed",
      fieldErrors: formatZodErrors(parsed.error),
    };
  }

  if (parsed.data.name) {
    const nameExists = await dbCheckGameTypeNameExists(
      gameType.leagueId,
      parsed.data.name,
      gameTypeId,
    );
    if (nameExists) {
      return {
        error: "Validation failed",
        fieldErrors: { name: "A game type with this name already exists" },
      };
    }
  }

  const updated = await dbUpdateGameType(gameTypeId, {
    name: parsed.data.name,
    description: parsed.data.description,
    logo: parsed.data.logo,
  });

  if (!updated) {
    return { error: "Failed to update game type" };
  }

  return { data: updated };
}

export async function archiveGameType(
  userId: string,
  gameTypeId: string,
): Promise<ServiceResult<void>> {
  const gameType = await dbGetGameTypeById(gameTypeId);
  if (!gameType) {
    return { error: "Game type not found" };
  }

  const membership = await getLeagueMember(userId, gameType.leagueId);
  if (!membership) {
    return { error: "You are not a member of this league" };
  }

  if (!canPerformAction(membership.role, LeagueAction.CREATE_GAME_TYPES)) {
    return { error: "You do not have permission to archive game types" };
  }

  await dbArchiveGameType(gameTypeId);
  return { data: undefined };
}

export async function unarchiveGameType(
  userId: string,
  gameTypeId: string,
): Promise<ServiceResult<void>> {
  const gameType = await dbGetGameTypeById(gameTypeId);
  if (!gameType) {
    return { error: "Game type not found" };
  }

  const membership = await getLeagueMember(userId, gameType.leagueId);
  if (!membership) {
    return { error: "You are not a member of this league" };
  }

  if (!canPerformAction(membership.role, LeagueAction.CREATE_GAME_TYPES)) {
    return { error: "You do not have permission to unarchive game types" };
  }

  await dbUnarchiveGameType(gameTypeId);
  return { data: undefined };
}

export async function deleteGameType(
  userId: string,
  gameTypeId: string,
): Promise<ServiceResult<void>> {
  const gameType = await dbGetGameTypeById(gameTypeId);
  if (!gameType) {
    return { error: "Game type not found" };
  }

  const membership = await getLeagueMember(userId, gameType.leagueId);
  if (!membership) {
    return { error: "You are not a member of this league" };
  }

  if (!canPerformAction(membership.role, LeagueAction.CREATE_GAME_TYPES)) {
    return { error: "You do not have permission to delete game types" };
  }

  const deleted = await dbDeleteGameType(gameTypeId);
  if (!deleted) {
    return { error: "Failed to delete game type" };
  }

  return { data: undefined };
}
