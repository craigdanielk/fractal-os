"use server";

export async function ensureIdentity(userId: string, email: string) {
  // For now this is a no-op identity initializer.
  // Future: write user_profile rows or enrich identity.
  return { userId, email };
}

