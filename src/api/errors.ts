import { Request, Response, NextFunction } from "express";
import { respondWithError } from "./json.js";

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof BadRequestError) {
    respondWithError(res, 400, err.message);
  } else if (err instanceof UnauthorizedError) {
    respondWithError(res, 401, err.message);
  } else if (err instanceof ForbiddenError) {
    respondWithError(res, 403, err.message);
  } else if (err instanceof NotFoundError) {
    respondWithError(res, 404, err.message);
  } else {
    respondWithError(res, 500, err.message);
  }

  next();
}
