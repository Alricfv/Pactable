import type { User } from "@supabase/supabase-js";

export const SUPABASE_USER_HEADER = "x-pactable-auth-user";
export const SUPABASE_AUTH_ERROR_HEADER = "x-pactable-auth-error";
export const SUPABASE_AUTH_ERROR_MESSAGE_HEADER = "x-pactable-auth-error-message";

export type AuthenticatedUserPayload = Pick<User, "id" | "email" | "app_metadata" | "user_metadata" | "aud" | "role"> & {
  phone?: User["phone"];
};

export function encodeUserForHeader(user: User) {
  const payload: AuthenticatedUserPayload = {
    id: user.id,
    email: user.email,
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata,
    aud: user.aud,
    role: user.role,
    phone: user.phone,
  };

  return encodeURIComponent(JSON.stringify(payload));
}

export function decodeUserFromHeader(value: string | null): AuthenticatedUserPayload | null {
  if (!value) return null;
  try {
    return JSON.parse(decodeURIComponent(value)) as AuthenticatedUserPayload;
  } catch (error) {
    console.error("Failed to decode Supabase user header", error);
    return null;
  }
}
