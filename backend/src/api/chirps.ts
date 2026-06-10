import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "./errors.js";
import { CreateChirpRequest } from "../types/chirps.js";
import {
  createChirp,
  deleteChirpById,
  getChirpById,
  getChirps,
  getChirpsByUserId,
} from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth/auth.js";
import { Chirp } from "../db/schema.js";

type sort = "asc" | "desc";

export async function handlerAddChirp(req: Request, res: Response) {
  const MAX_CHIRP_LENGTH = 140;

  const { body } = req.body as CreateChirpRequest;

  if (body.length >= MAX_CHIRP_LENGTH) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const filteredBody = filterWords(body);

  const bearer = getBearerToken(req);
  const userId = validateJWT(bearer, config.secret);
  if (!userId) {
    throw new UnauthorizedError("You cannot post a chirp");
  }

  try {
    const chirp = await createChirp({ body: filteredBody, userId: userId });
    respondWithJSON(res, 201, chirp);
  } catch (err) {
    throw new BadRequestError(`Error adding chirp: ${(err as Error).message}`);
  }
}

export async function handlerAllChirps(req: Request, res: Response) {
  const authorId = req.query.authorId as string;
  let sort = req.query.sort as sort;
  let allChirps: Chirp[];

  if (!sort) {
    sort = "asc";
  }

  if (!authorId) {
    allChirps = await getChirps();
  } else {
    allChirps = await getChirpsByUserId(authorId);
  }

  allChirps.sort((chirpOne, chirpTwo) =>
    compareChirpsByCreatedAt(chirpOne.createdAt!, chirpTwo.createdAt!, sort),
  );

  respondWithJSON(res, 200, allChirps);
}

export async function handlerGetChirpById(req: Request, res: Response) {
  const id = req.params.chirpId as string;

  const chirp = await getChirpById(id);
  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }
  respondWithJSON(res, 200, chirp);
}

export async function handlerDeleteChirpById(req: Request, res: Response) {
  const id = req.params.chirpId as string;

  const accessToken = getBearerToken(req);
  const userId = validateJWT(accessToken, config.secret);

  const chirp = await getChirpById(id);
  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }

  if (chirp.userId != userId) {
    throw new ForbiddenError("User not allowed to delete the chirp");
  }

  const deletedChirp = await deleteChirpById(chirp.id as string);
  if (!deletedChirp) {
    throw new NotFoundError("Chirp not found");
  }
  res.status(204).send();
}

function filterWords(body: string) {
  const words = body.split(" ");

  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();
    if (word === "kerfuffle" || word === "sharbert" || word === "fornax") {
      words[i] = "****";
    }
  }

  return words.join(" ").trim();
}

function compareChirpsByCreatedAt(
  chirpOne: Date,
  chirpTwo: Date,
  sortBy: sort,
): number {
  const order = sortBy === "asc" ? 1 : -1;
  return (chirpOne.getTime() - chirpTwo.getTime()) * order;
}
