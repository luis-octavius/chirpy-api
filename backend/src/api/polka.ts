import { Request, Response } from "express";
import type { Webhook } from "../types/users.js";
import { updateChirpyRedStatusById } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { getApiKey } from "../auth/auth.js";
import { config } from "../config.js";

export async function handlerUpdateMembership(req: Request, res: Response) {
  const { event, data } = req.body as Webhook;
  const apiKey = getApiKey(req);

  if (apiKey != config.apiKey) {
    throw new UnauthorizedError("Invalid Api Key");
  }

  if (event != "user.upgraded") {
    res.status(204).send();
    return;
  }

  const updatedUser = await updateChirpyRedStatusById(data.userId);
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  res.status(204).send();
}
