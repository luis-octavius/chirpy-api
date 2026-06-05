import { db } from "../index.js";
import { users, refreshTokens, NewUser } from "../schema.js";
import { config } from "../../config.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(userId: string, token: string) {
  const [newRefreshToken] = await db
    .insert(refreshTokens)
    .values({
      userId: userId,
      token: token,
      expiresAt: config.defaultRefreshDuration,
      revokedAt: null,
    })
    .returning();
  return newRefreshToken;
}

export async function getEntryByToken(token: string) {
  const [entry] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return entry;
}

export async function getUserFromRefreshToken(token: string) {
  const [user] = await db
    .select()
    .from(refreshTokens)
    .innerJoin(users, eq(users.id, refreshTokens.userId))
    .where(eq(refreshTokens.token, token));
  return user?.users;
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({
      revokedAt: new Date(Date.now()),
    })
    .where(eq(refreshTokens.token, token));
}
