import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { CreateChirpRequest } from "../types/chirps.js";
import { createChirp, getChirpById, getChirps } from "../db/queries/chirps.js";

export async function handlerAddChirp(req: Request, res: Response) {
  const MAX_CHIRP_LENGTH = 140;

  const { body, userId } = req.body as CreateChirpRequest;

  if (body.length >= MAX_CHIRP_LENGTH) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const filteredBody = filterWords(body);

  try {
    const chirp = await createChirp({ body, userId });
    respondWithJSON(res, 201, chirp);
  } catch (err) {
    throw new BadRequestError(`Error adding chirp: ${(err as Error).message}`);
  }
}

export async function handlerAllChirps(req: Request, res: Response) {
  try {
    let allChirps = await getChirps();
    console.log("allChirps: ", allChirps);
    respondWithJSON(res, 200, allChirps);
  } catch (err) {
    throw new Error("Error getting all the chirps");
  }
}

export async function handlerGetChirpById(req: Request, res: Response) {
  const id = req.params.chirpId as string;

  try {
    const chirp = await getChirpById(id);
    respondWithJSON(res, 200, chirp);
  } catch (err) {
    throw new NotFoundError("Chirp not found");
  }
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
