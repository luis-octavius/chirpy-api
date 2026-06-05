import * as argon from "argon2";
import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import type { payload } from "../types/auth.js";
import { BadRequestError, UnauthorizedError } from "../api/errors.js";
import { Request } from "express";
import { config } from "../config.js";

export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await argon.hash(password);
    return hash;
  } catch (err) {
    throw new Error("Error hashing the password");
  }
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    if (await argon.verify(hash, password)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error("Internal server error");
  }
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000); // current time in seconds
  const payload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: iat,
    exp: config.defaultJWTDuration.getTime(),
  };

  const token = jwt.sign(payload, secret, { algorithm: "HS256" });
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const payload = jwt.verify(tokenString, secret) as payload;
    return payload.sub as string;
  } catch (err) {
    throw new UnauthorizedError("Token is invalid");
  }
}

export function getBearerToken(req: Request): string {
  const bearerToken = req.get("Authorization");
  if (!bearerToken) throw new UnauthorizedError("Authorization not found");

  return extractBearerToken(bearerToken);
}

export function extractBearerToken(header: string): string {
  const token = header.replace("Bearer", "").trim();
  if (!token) throw new BadRequestError("Invalid token");
  return token;
}

export function makeRefreshToken(): string {
  const hexStr = randomBytes(256);
  return hexStr.toString("hex");
}
