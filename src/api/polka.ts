import { Request, Response } from "express";
import type { Webhook } from "../types/users.js";
import { updateChirpyRedStatusById } from "../db/queries/users.js";
import { NotFoundError } from "./errors.js";

export async function handlerUpdateMembership(req: Request, res: Response) {
  const { event, data } = req.body as Webhook;

  if (event != "user.upgraded") {
    res.status(204).send();
    return;
  }

  const updatedUser = await updateChirpyRedStatusById(data.userId);
  console.log("updatedUser: ", updatedUser);
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  res.status(204).send();
}
