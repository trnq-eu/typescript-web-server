import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { createChirp, getChirp, getChirps, deleteChirp, getChirpsByAuthorId } from "../db/queries/chirps.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

interface Chirp {
  id: string;
  createdAt: Date; 
  updatedAt: Date;   
  body: string;
  userId: string;
}

export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  const cleaned = validateChirp(params.body);
  const chirp = await createChirp({ body: cleaned, userId: userId });

  respondWithJSON(res, 201, chirp);
}

function validateChirp(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`,
    );
  }

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  return getCleanedBody(body, badWords);
}

function getCleanedBody(body: string, badWords: string[]) {
  const words = body.split(" ");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleaned = words.join(" ");
  return cleaned;
}

export async function handlerChirpsRetrieve(req: Request, res: Response) {
  let chirps: Chirp[] = [];
  let authorId = "";
  let authorIdQuery = req.query.authorId;
  let sortOrder = req.query.sort
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }
  if (authorId) {
    chirps = await getChirpsByAuthorId(authorId)
  } else {
    chirps = await getChirps()
  }

  
  if (sortOrder === "asc" || !sortOrder ) {
      chirps.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else {
      chirps = chirps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  respondWithJSON(res, 200, chirps);
}

export async function handlerChirpsGet(req: Request, res: Response) {
  const { chirpId } = req.params;

  const chirp = await getChirp(chirpId);
  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }

  respondWithJSON(res, 200, chirp);
}

export async function handlerChirpsDelete(req: Request, res: Response) {
  const { chirpId } = req.params;

  const retrievedChirp = await getChirp(chirpId);
  if (!retrievedChirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }


  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);
 
  if (userId != retrievedChirp.userId) {
    respondWithJSON(res, 403, `User not authenticated`);
    return;
  }
  
  await deleteChirp(chirpId)
  

  respondWithJSON(res, 204, "");
}

