import type { Request, Response } from "express";

import { createUser, updateUser, upgradeUser } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { NewUser } from "src/db/schema.js";
import { getBearerToken, hashPassword, validateJWT, getAPIKey } from "../auth.js";
import { config } from "../config.js"


export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };
  const params: parameters = req.body;

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({
    email: params.email,
    hashedPassword,
  } satisfies NewUser);

  if (!user) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed
  } satisfies UserResponse);
}

export async function handlerUserUpgrade(req: Request, res: Response) {
  type parameters = {
    event: string,
    data: {
      userId: string
    }
  };

  const polkaApiKey = await getAPIKey(req)
  const polkaApiEnv = config.polka.apiKey

  if (polkaApiKey != polkaApiEnv) {
    respondWithJSON(res, 401,{})
    return;
  }

  const params: parameters = req.body;

  if (params.event != "user.upgraded") {
    respondWithJSON(res, 204,{})
    return
  }

  const upgrade = await upgradeUser(params.data.userId);

  if (upgrade) {
    respondWithJSON(res, 204,{})
  } else {
    respondWithJSON(res, 404,{})
  }
}

export async function handlerUsersUpdate(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const token = getBearerToken(req);
  const subject = validateJWT(token, config.jwt.secret);

  const params: parameters = req.body;

  if (!params.password || !params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await updateUser(
    subject,
    params.email,
    hashedPassword
  );

 

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed
  } satisfies UserResponse);
}



  
