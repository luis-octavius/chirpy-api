import * as argon from "argon2";

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
