import type { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "./json.js";
import { BadRequestError, NotFoundError } from "./errors.js"

const profaneWords = ["kerfuffle", "sharbert", "fornax"];

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;
  const maxChirpLength = 140;

  if (!params || !params.body || typeof params.body !== 'string') {
    throw new BadRequestError("Invalid request body: body property missing or incorrect type");
    return;
  }

  if (params.body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  let cleanedBody = params.body;
  const words = params.body.split(" ");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const lowerCaseWord = word.toLowerCase();

    if (profaneWords.includes(lowerCaseWord)) {
      cleanedBody = cleanedBody.replace(word, "****");
    }
  }

  respondWithJSON(res, 200, { cleanedBody: cleanedBody });
}