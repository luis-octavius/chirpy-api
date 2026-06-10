import { db } from "../index.js";
import { users, chirps, Chirp } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createChirp(chirp: Chirp) {
  const [newChirp] = await db
    .insert(chirps)
    .values({
      body: chirp.body,
      userId: chirp.userId,
    })
    .returning();
  return newChirp as Chirp;
}

export async function getChirps() {
  const allChirps = await db.select().from(chirps).orderBy(chirps.createdAt);
  return allChirps as Chirp[];
}

export async function getChirpById(id: string) {
  const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id));
  return chirp as Chirp;
}

export async function getChirpsByUserId(userId: string) {
  const userChirps = await db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, userId));
  return userChirps;
}

export async function deleteChirpById(id: string) {
  const [deletedChirp] = await db
    .delete(chirps)
    .where(eq(chirps.id, id))
    .returning();
  return deletedChirp;
}
