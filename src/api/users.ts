import { Request, Response } from "express";
import { createUser, deleteUsers } from "../db/queries/users.js";
import { CreateUserRequest, CreateUserResponse } from "../types/users.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { UnauthorizedError } from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
  const { email } = req.body as CreateUserRequest;

  try {
    const user = await createUser({ email: email });

    respondWithJSON(res, 201, {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as CreateUserResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
}

export async function handlerReset(_: Request, res: Response) {
  if (config.platform != "dev") {
    throw new UnauthorizedError(
      "You have to be in dev mod to use this endpoint!",
    );
  }

  config.fileServerHits = 0;

  try {
    await deleteUsers();

    const msg = "Users deleted successfully";
    console.log(msg);
    respondWithJSON(res, 200, msg);
    return;
  } catch (err) {
    console.error(err);
  }
}
