import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SUPABASE_AUTH_ERROR_HEADER,
  SUPABASE_AUTH_ERROR_MESSAGE_HEADER,
  SUPABASE_USER_HEADER,
  decodeUserFromHeader,
  type AuthenticatedUserPayload,
} from "./authHeaders";

export function getRequestUser(): AuthenticatedUserPayload | null {
  return decodeUserFromHeader(headers().get(SUPABASE_USER_HEADER));
}

export function getAuthErrorFromHeaders() {
  const code = headers().get(SUPABASE_AUTH_ERROR_HEADER);
  if (!code) return null;
  const messageHeader = headers().get(SUPABASE_AUTH_ERROR_MESSAGE_HEADER);
  return {
    code,
    message: messageHeader ? decodeURIComponent(messageHeader) : undefined,
  };
}

export function requireUser() {
  const authError = getAuthErrorFromHeaders();
  if (authError) {
    throw new Error(authError.message ?? `Supabase auth error (${authError.code})`);
  }

  const user = getRequestUser();
  if (!user) {
    redirect("/signin");
  }

  return user;
}
