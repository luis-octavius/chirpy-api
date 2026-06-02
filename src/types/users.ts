export type CreateUserRequest = {
  email: string;
};

export type CreateUserResponse = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
