"use server";

import { GameType } from "@/db/schema";
import { auth } from "@/lib/server/auth";
import {
  archiveGameType as archiveGameTypeService,
  createGameType as createGameTypeService,
  deleteGameType as deleteGameTypeService,
  unarchiveGameType as unarchiveGameTypeService,
  updateGameType as updateGameTypeService,
} from "@/services/game-types";
import { ServiceResult } from "@/services/shared";
import { headers } from "next/headers";

export async function createGameTypeAction(
  leagueId: string,
  input: unknown,
): Promise<ServiceResult<GameType>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  return createGameTypeService(session.user.id, leagueId, input);
}

export async function updateGameTypeAction(
  gameTypeId: string,
  input: unknown,
): Promise<ServiceResult<GameType>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  return updateGameTypeService(session.user.id, gameTypeId, input);
}

export async function archiveGameTypeAction(
  gameTypeId: string,
): Promise<ServiceResult<void>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  return archiveGameTypeService(session.user.id, gameTypeId);
}

export async function deleteGameTypeAction(
  gameTypeId: string,
): Promise<ServiceResult<void>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  return deleteGameTypeService(session.user.id, gameTypeId);
}

export async function unarchiveGameTypeAction(
  gameTypeId: string,
): Promise<ServiceResult<void>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  return unarchiveGameTypeService(session.user.id, gameTypeId);
}
