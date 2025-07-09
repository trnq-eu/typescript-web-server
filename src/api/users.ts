import type { Request, Response } from "express";

import { createUser, lookupUser } from "../db/queries/users.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { hashPassword, checkPasswordHash} from "../auth.js"

export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    email: string,
    password: string
  };
  const params: parameters = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing required fields");
  }

   if (!params.password) {
    throw new BadRequestError("Missing password field");
  }

  const hashedPassword = await hashPassword(params.password)

 
  const user = await createUser({ 
    email: params.email, 
    hashed_password: hashedPassword});

  if (!user) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}


export async function handlerUsersLogin(req: Request, res: Response) {
  type parameters = {
    email: string,
    password: string
  };
  const params: parameters = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing email field");
  }

   if (!params.password) {
    throw new BadRequestError("Missing password field");
  }

  const user = await lookupUser(params.email)

  if (!user) {
  respondWithJSON(res, 401, { error: "Incorrect email or password" });
  return;
}
  const checkPassword = await checkPasswordHash(params.password, user.hashed_password);

  if (!checkPassword) {
    respondWithJSON(res, 401, { error: "Incorrect email or password" });
  return;
  } else {
    respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email
  });
  }
}