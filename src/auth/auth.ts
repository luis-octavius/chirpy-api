import * as argon from "argon2";
import jwt from "jsonwebtoken";
import type { payload } from "../types/auth.js";
import { UnauthorizedError } from "../api/errors.js";

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
    exp: iat + expiresIn,
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
