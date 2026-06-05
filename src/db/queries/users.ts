import { CreateUserResponse } from "../../types/users.js";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [newUser] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return newUser;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function updateEmailAndPassword(password: string, email: string) {
  const [updatedUser] = await db
    .update(users)
    .set({
      hashedPassword: password,
      email: email,
    })
    .returning();
  const omitPassword = updatedUser as CreateUserResponse;
  return omitPassword;
}
