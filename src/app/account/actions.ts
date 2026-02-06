"use server";

import { auth } from "@/lib/server/auth";
import { ServiceResult } from "@/services/shared";
import { deleteUserAccount as deleteUserAccountService } from "@/services/users";
import { headers } from "next/headers";

export async function deleteAccountAction(): Promise<
  ServiceResult<{ deleted: boolean }>
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  return deleteUserAccountService(session.user.id);
}
