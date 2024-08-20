"use server";

import { signOut } from "@/auth";

export async function signOutServerAction(
  currentState: { redirectTo?: string },
  formData: FormData
) {
  await signOut({
    redirectTo: currentState.redirectTo ? currentState.redirectTo : "/",
    redirect: true,
  });
  // this should never happen
  return {
    redirectTo: currentState.redirectTo ? currentState.redirectTo : "/",
  };
}
