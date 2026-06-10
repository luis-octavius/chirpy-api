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
  _: Request,
  res: Response,
  __: NextFunction,
) {
  if (err instanceof BadRequestError) {
    return respondWithError(res, 400, err.message);
  } else if (err instanceof UnauthorizedError) {
    return respondWithError(res, 401, err.message);
  } else if (err instanceof ForbiddenError) {
    return respondWithError(res, 403, err.message);
  } else if (err instanceof NotFoundError) {
    return respondWithError(res, 404, err.message);
  } else {
    return respondWithError(res, 500, err.message);
  }
}
