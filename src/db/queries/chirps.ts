import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [rows] = await db.insert(chirps).values(chirp).returning();
  return rows;
}

export async function getChirps() {
  return db.select().from(chirps);
}

export async function getChirpsByAuthorId(authorId: string) {
  return db.select().from(chirps).where(eq(chirps.userId, authorId))
}

export async function getChirp(id: string) {
  const rows = await db.select().from(chirps).where(eq(chirps.id, id));
  if (rows.length === 0) {
    return;
  }
  return rows[0];
}

export async function deleteChirp(id: string) {
  const chirp_row = await db.delete(chirps).where(eq(chirps.id, id)); 
  return chirp_row
}