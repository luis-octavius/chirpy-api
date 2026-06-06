import { Request, Response } from "express";
import {
  createUser,
  deleteUsers,
  getUserByEmail,
  updateEmailAndPassword,
} from "../db/queries/users.js";
import { UserRequest, CreateUserResponse } from "../types/users.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";
import { BadRequestError, UnauthorizedError } from "./errors.js";
import {
  checkPasswordHash,
  getBearerToken,
  hashPassword,
  makeJWT,
  makeRefreshToken,
  validateJWT,
} from "../auth/auth.js";
import {
  createRefreshToken,
  getEntryByToken,
  getUserFromRefreshToken,
  revokeRefreshToken,
} from "../db/queries/refresh.js";

export async function handlerCreateUser(req: Request, res: Response) {
  const { email, password } = req.body as UserRequest;

  const hashedPassword = await hashPassword(password);
  const user = await createUser({
    email: email,
    hashedPassword: hashedPassword,
  });

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } as CreateUserResponse);
}

export async function handlerReset(_: Request, res: Response) {
  if (config.platform != "dev") {
    throw new UnauthorizedError(
      "You have to be in dev mod to use this endpoint!",
    );
  }

  config.fileServerHits = 0;

  await deleteUsers();

  const msg = "Users deleted successfully";
  respondWithJSON(res, 200, msg);
}

export async function handlerLogin(req: Request, res: Response) {
  const { email, password } = req.body as UserRequest;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      throw new Error();
    }
    const isUserPassword = await checkPasswordHash(
      password,
      user.hashedPassword,
    );

    if (!isUserPassword) {
      throw new Error();
    }

    const token = makeJWT(user.id, 3600, config.secret);
    const refreshToken = makeRefreshToken();

    const _ = await createRefreshToken(user.id, refreshToken);

    const { hashedPassword, ...safeUser } = user;

    respondWithJSON(res, 200, {
      ...safeUser,
      token,
      refreshToken,
    });
  } catch (err) {
    throw new UnauthorizedError("Incorrect email or password");
  }
}

export async function handlerRefreshToken(req: Request, res: Response) {
  const refreshTokenFromHeader = getBearerToken(req);

  if (!refreshTokenFromHeader) {
    throw new UnauthorizedError("Token is not valid");
  }

  const entryRefreshToken = await getEntryByToken(refreshTokenFromHeader);
  if (
    entryRefreshToken.revokedAt ||
    entryRefreshToken.expiresAt.getTime() < Date.now()
  ) {
    throw new UnauthorizedError("Refresh token expired or does not exist");
  }

  const user = await getUserFromRefreshToken(refreshTokenFromHeader);

  const jwtToken = makeJWT(
    user.id,
    config.jwt.jwtDuration.getTime(),
    config.secret,
  );

  respondWithJSON(res, 200, {
    token: jwtToken,
  });
}

export async function handlerRevokeRefreshToken(req: Request, res: Response) {
  const refreshTokenFromHeader = getBearerToken(req);

  try {
    await revokeRefreshToken(refreshTokenFromHeader);
    respondWithJSON(res, 204, {});
  } catch (err) {
    throw new Error("Error revoking refresh token");
  }
}

export async function handlerUpdateUser(req: Request, res: Response) {
  const accessToken = getBearerToken(req);

  if (!accessToken) {
    throw new UnauthorizedError("Invalid access token");
  }

  const userId = validateJWT(accessToken, config.secret);
  if (!userId) {
    throw new UnauthorizedError("Token have expired or is not valid");
  }

  const { password, email } = req.body;

  const hashedPassword = await hashPassword(password);
  if (!hashedPassword || !password || !email) {
    throw new BadRequestError("Invalid request");
  }

  const updatedUser = await updateEmailAndPassword(hashedPassword, email);
  respondWithJSON(res, 200, updatedUser);
}
