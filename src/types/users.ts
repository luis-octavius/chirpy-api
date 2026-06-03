import type { NewUser } from "../db/schema.js";

export type UserRequest = {
  email: string;
  password: string;
};

export type CreateUserResponse = Omit<NewUser, "hashedPassword">;
