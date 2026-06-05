import { describe, it, expect, beforeAll } from "vitest";
import {
  makeJWT,
  validateJWT,
  hashPassword,
  checkPasswordHash,
  extractBearerToken,
} from "./auth.js";
import { BadRequestError, UnauthorizedError } from "../api/errors.js";
import { Request } from "express";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Password hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password2, hash2);
    expect(result).toBe(true);
  });

  it("should return false for the incorrect password", async () => {
    const result = await checkPasswordHash("incorrectPassword123!", hash1);
    expect(result).toBe(false);
  });

  it("should return false for the incorrect password", async () => {
    const result = await checkPasswordHash("incorrectPassword456!", hash2);
    expect(result).toBe(false);
  });
});

describe("JWT validation", () => {
  const secret1 = "ataraxia";
  const secret2 = "enkrateia";
  const userID1 = crypto.randomUUID();
  const userID2 = crypto.randomUUID();
  let tokenOne: string;
  let tokenTwo: string;

  beforeAll(async () => {
    tokenOne = makeJWT(userID1, 3000, secret1);
    tokenTwo = makeJWT(userID2, 1, secret2);
  });

  it("should return userID1 correctly", () => {
    const result = validateJWT(tokenOne, secret1);
    expect(result).toStrictEqual(userID1);
  });

  it("should return userID2 correctly", () => {
    const result = validateJWT(tokenTwo, secret2);
    expect(result).toStrictEqual(userID2);
  });

  it("should throw 'invalid' if token expires", async () => {
    await delay(1000);
    expect(() => validateJWT(tokenTwo, secret2)).toThrow(/invalid/);
  });

  it("should throw 'UnauthorizedError' when token expires", async () => {
    await delay(1000);
    expect(() => validateJWT(tokenTwo, secret2)).toThrowError(
      UnauthorizedError,
    );
  });

  it("should throw 'UnauthorizedError' with wrong-secret", () => {
    expect(() => validateJWT(tokenTwo, "wrong-secret")).toThrowError(
      UnauthorizedError,
    );
  });
});

describe("Bearer Token validation", () => {
  it("should extract the token from a valid header", () => {
    const header = "Bearer myToken123";
    expect(extractBearerToken(header)).toBe("myToken123");
  });

  it("should throw an error if the token is invalid", () => {
    const header = "Bearer";
    expect(() => extractBearerToken(header)).toThrowError(BadRequestError);
  });
});
