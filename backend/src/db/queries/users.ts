import { NotFoundError } from "../../api/errors.js";
import { CreateUserResponse } from "../../types/users.js";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq, getTableColumns } from "drizzle-orm";

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

export async function updateEmailAndPassword(
  userId: string,
  password: string,
  email: string,
) {
  const [updatedUser] = await db
    .update(users)
    .set({
      hashedPassword: password,
      email: email,
    })
    .where(eq(users.id, userId))
    .returning();
  const { hashedPassword, ...safeUser } = updatedUser;
  return safeUser;
}

export async function updateChirpyRedStatusById(userId: string) {
  const [updatedUser] = await db
    .update(users)
    .set({
      isChirpyRed: true,
    })
    .where(eq(users.id, userId))
    .returning();
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  const { hashedPassword, ...otherColumns } = updatedUser;
  return otherColumns;
}
