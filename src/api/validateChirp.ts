import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const MAX_CHIRP_LENGTH = 140;

  try {
    const { body } = req.body as parameters;

    if (body.length >= MAX_CHIRP_LENGTH) {
      return respondWithError(res, 400, "Chirp is too long");
    }

    const filteredBody = filterWords(body);

    respondWithJSON(res, 200, {
      cleanedBody: filteredBody,
    });
  } catch (error) {
    return respondWithError(res, 500, "Internal server error");
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
