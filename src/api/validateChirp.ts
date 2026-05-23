import { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length >= maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
  }

  respondWithJSON(res, 200, {
    valid: true,
  });
}
