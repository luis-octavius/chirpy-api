import { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const MAX_CHIRP_LENGTH = 140;

  const { body } = req.body as parameters;

  if (body.length >= MAX_CHIRP_LENGTH) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const filteredBody = filterWords(body);

  respondWithJSON(res, 200, {
    cleanedBody: filteredBody,
  });
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
