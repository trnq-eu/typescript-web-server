import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { desc, asc, eq } from 'drizzle-orm';


export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}


export async function selectChirpById(chirpId: string) {
  const result = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, chirpId));
  return result
}

export async function getAllChirps() {
  const result = await db.query.chirps.findMany(
    {
      orderBy: [asc(chirps.createdAt)]
    }
  )
  
  return result
}

export async function reset() {
  await db.delete(chirps);
}


