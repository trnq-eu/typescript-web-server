import type { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerReset(_: Request, res: Response) {
  config.fileServerHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8")
  res.status(200).send("Hits reset to 0");
}
