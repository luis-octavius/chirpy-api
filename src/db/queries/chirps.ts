import { db } from "../index.js";
import { chirps, Chirp } from "../schema.js";
import { CreateChirpRequest } from "../../types/chirps.js";

export async function createChirp(chirp: CreateChirpRequest) {
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
